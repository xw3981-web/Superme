// src/pages/Index.tsx (这是修改后的完整版本)

import { useState, useEffect } from "react"; // 导入 useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles, Gift, Plus, X, CalendarIcon, Package } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PomodoroTimer } from "@/components/PomodoroTimer";

// 你的后端 API 地址
const API_URL = 'http://localhost:3000/api';

// 任务类型 (与你的 UI 匹配)
interface Task {
  id: string; // 后端 ID 是 number, 我们转为 string
  task: string;
  deadline?: Date;
}

// 后端返回的任务类型
interface BackendTask {
  id: number;
  content: string;
  dueDate: string | null;
}

// 辅助函数：转换后端数据为前端格式
const formatTaskForFrontend = (task: BackendTask): Task => ({
  id: task.id.toString(),
  task: task.content,
  deadline: task.dueDate ? new Date(task.dueDate) : undefined,
});

// 辅助函数：转换前端日期为后端格式
const formatTaskForBackend = (date: Date | undefined): string | null => {
  return date ? date.toISOString().split('T')[0] : null;
};


const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");

  // 新增：在组件加载时从后端获取所有任务
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await fetch(`${API_URL}/tasks`);
        if (!response.ok) {
          throw new Error('获取任务列表失败');
        }
        const backendTasks: BackendTask[] = await response.json();
        // 转换数据
        setTasks(backendTasks.map(formatTaskForFrontend));
      } catch (error) {
        console.error(error);
        toast.error("无法加载任务，请检查后端服务是否运行。");
      }
    };
    loadTasks();
  }, []); // 空依赖数组 [] 确保只在加载时运行一次

  // 修改：添加任务到后端
  const addTask = async () => {
    if (!inputValue.trim()) {
      toast.error("请输入任务内容！");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: inputValue.trim(),
          dueDate: formatTaskForBackend(deadline),
        }),
      });

      if (!response.ok) {
        throw new Error('添加失败');
      }

      const newTask: BackendTask = await response.json();
      setTasks([...tasks, formatTaskForFrontend(newTask)]); // 将新任务添加到 UI
      setInputValue("");
      setDeadline(undefined);
      toast.success("任务已添加到盲盒！");

    } catch (error) {
      console.error(error);
      toast.error("添加任务时出错。");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  // 修改：从后端删除任务
  const removeTask = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('删除失败');
      }

      setTasks(tasks.filter((t) => t.id !== id)); // 从 UI 移除
      toast("任务已移除");

    } catch (error) {
      console.error(error);
      toast.error("删除任务时出错。");
    }
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingValue(task.task);
  };

  // 修改：更新任务到后端
  const saveEditTask = async (id: string) => {
    if (!editingValue.trim()) {
      toast.error("任务内容不能为空");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editingValue.trim(),
          // 注意：这里的编辑逻辑只更新了内容，没更新日期
          // 如果需要更新日期，也需要把它加到 body 里
        }),
      });

      if (!response.ok) {
        throw new Error('更新失败');
      }

      const updatedTask: BackendTask = await response.json();
      // 更新 UI
      setTasks(tasks.map((t) =>
        t.id === id ? formatTaskForFrontend(updatedTask) : t
      ));
      setEditingTaskId(null);
      setEditingValue("");
      toast.success("任务已更新");

    } catch (error) {
      console.error(error);
      toast.error("更新任务时出错。");
    }
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingValue("");
  };

  // 修改：从后端抽取任务
  const pickRandomTask = async () => {
    setIsAnimating(true);
    setSelectedTask(null);

    try {
      const response = await fetch(`${API_URL}/tasks/random`);

      if (response.status === 404) {
        toast.error("盲盒是空的！请先添加任务");
        setIsAnimating(false);
        return;
      }

      if (!response.ok) {
        throw new Error('抽取失败');
      }

      const drawnTask: BackendTask = await response.json();
      const formattedTask = formatTaskForFrontend(drawnTask);

      setTimeout(() => {
        setSelectedTask(formattedTask);
        // 重要：后端 API 在抽取时删除了任务，所以我们也要从 UI 列表移除
        setTasks(tasks.filter((t) => t.id !== formattedTask.id));
        setIsAnimating(false);
        toast.success("✨ 恭喜！抽中了一个任务！");
      }, 500);

    } catch (error) {
      console.error(error);
      setIsAnimating(false);
      toast.error("抽取任务时出错。");
    }
  };

  const toggleBox = () => {
    setIsBoxOpen(!isBoxOpen);
  };

  // ... 下面的 JSX (HTML) 部分保持不变 ...
  // ... (把你原来的 return (...) 语句粘贴到这里) ...
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="text-center space-y-4 animate-fade-in">
              <div className="flex items-center justify-center gap-3">
                <Gift className="w-12 h-12 text-primary" />
                <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                  任务盲盒
                </h1>
                <Sparkles className="w-12 h-12 text-secondary" />
              </div>
              <p className="text-muted-foreground text-lg">
                把你的任务放进盲盒，让命运决定下一步做什么 ✨
              </p>
            </div>

            {/* Input Section */}
            <Card className="p-6 gradient-primary glow-effect border-0 animate-scale-in">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="输入一个任务..."
                    className="flex-1 bg-white/90 border-0 text-lg h-12 focus-visible:ring-2 focus-visible:ring-accent"
                  />
                  <Button
                    onClick={addTask}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 font-semibold px-6"
                  >
                    <Plus className="w-5 h-5" />
                    添加
                  </Button>
                </div>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-white/90 border-0",
                        !deadline && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP", { locale: zhCN }) : "选择截止日期（可选）"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      initialFocus
                      className="pointer-events-auto"
                    />
                    {deadline && (
                      <div className="p-3 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={() => setDeadline(undefined)}
                        >
                          清除日期
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </Card>

            {/* Single Large Mystery Box */}
            {tasks.length > 0 && (
              <Card className="p-6 space-y-4 animate-scale-in">
                <div 
                  onClick={toggleBox}
                  className={cn(
                    "relative cursor-pointer transition-all duration-500",
                    "rounded-2xl p-8",
                    isBoxOpen 
                      ? "bg-gradient-to-br from-primary/10 to-secondary/10" 
                      : "gradient-primary glow-effect"
                  )}
                >
                  <div className="flex flex-col items-center justify-center gap-4">
                    <Gift className={cn(
                      "w-24 h-24 transition-all duration-500",
                      isBoxOpen ? "text-primary" : "text-white"
                    )} />
                    <h2 className={cn(
                      "text-2xl font-bold transition-colors duration-500",
                      isBoxOpen ? "text-foreground" : "text-white"
                    )}>
                      {isBoxOpen ? "任务列表" : "神秘盲盒"}
                    </h2>
                    <p className={cn(
                      "text-lg transition-colors duration-500",
                      isBoxOpen ? "text-muted-foreground" : "text-white/90"
                    )}>
                      {isBoxOpen ? "点击任务可编辑" : `${tasks.length} 个任务等待你探索`}
                    </p>
                  </div>
                </div>

                {/* Task List - shown when box is open */}
                {isBoxOpen && (
                  <div className="space-y-3 animate-fade-in mt-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className="group relative p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
                      >
                        {editingTaskId === task.id ? (
                          <div className="space-y-2">
                            <Input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                  saveEditTask(task.id);
                                }
                              }}
                              className="w-full"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => saveEditTask(task.id)}
                              >
                                保存
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                              >
                                取消
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div 
                            className="flex items-start justify-between gap-4 cursor-pointer"
                            onClick={() => startEditTask(task)}
                          >
                            <div className="flex-1">
                              <p className="text-base font-medium">{task.task}</p>
                              {task.deadline && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  📅 截止：{format(task.deadline, "PPP", { locale: zhCN })}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeTask(task.id);
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {/* Pick Button */}
            <div className="flex justify-center">
              <Button
                onClick={pickRandomTask}
                disabled={isAnimating || tasks.length === 0}
                size="lg"
                className="gradient-secondary glow-effect text-white font-bold text-xl px-12 py-8 h-auto rounded-2xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-xl"
              >
                <Sparkles className={`w-6 h-6 mr-2 ${isAnimating ? "animate-spin" : ""}`} />
                {isAnimating ? "抽取中..." : "抽一个任务！"}
              </Button>
            </div>

            {/* Selected Task Display */}
            {selectedTask && !isAnimating && (
              <Card className="p-8 text-center space-y-4 gradient-primary glow-effect border-0 animate-scale-in">
                <div className="flex justify-center">
                  <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold text-white">你抽中的任务是：</h3>
                <p className="text-3xl font-bold text-white animate-shake">{selectedTask.task}</p>
                {selectedTask.deadline && (
                  <p className="text-lg text-white/90">
                    截止日期：{format(selectedTask.deadline, "PPP", { locale: zhCN })}
                  </p>
                )}
                <div className="flex justify-center">
                  <Sparkles className="w-8 h-8 text-accent animate-pulse" />
                </div>
              </Card>
            )}

            {tasks.length === 0 && !selectedTask && (
              <Card className="p-12 text-center border-dashed border-2">
                <Gift className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground text-lg">
                  盲盒还是空的，快添加一些任务吧！
                </p>
              </Card>
            )}
          </div>

          {/* Right column - Pomodoro Timer */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <PomodoroTimer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
