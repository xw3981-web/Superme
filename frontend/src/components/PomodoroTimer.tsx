import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Pause, RotateCcw, Timer } from "lucide-react";

export const PomodoroTimer = () => {
  const [customMinutes, setCustomMinutes] = useState("25");
  // 强制使用 state 来驱动显示，不使用 ref
  const [timeInSeconds, setTimeInSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 当 customMinutes 变化时更新时间（仅在未运行时）
  useEffect(() => {
    if (!isRunning) {
      const num = parseInt(customMinutes, 10);
      if (!isNaN(num) && num >= 1 && num <= 120) {
        setTimeInSeconds(num * 60);
      } else if (customMinutes === "") {
        setTimeInSeconds(0);
      }
    }
  }, [customMinutes, isRunning]);

  // 定时器逻辑
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    console.log("启动定时器，初始时间:", timeInSeconds);

    intervalRef.current = setInterval(() => {
      setTimeInSeconds((prevTime) => {
        const newTime = prevTime - 1;
        console.log("当前时间:", newTime);
        
        if (newTime <= 0) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsRunning(false);
          alert("⏰ 番茄钟时间到！");
          
          const customMin = parseInt(customMinutes, 10) || 25;
          return customMin * 60;
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, customMinutes, timeInSeconds]);

  const handleStart = () => {
    if (timeInSeconds <= 0) {
      alert("请先设置有效时间！");
      return;
    }
    console.log("开始按钮被点击，时间:", timeInSeconds);
    setIsRunning(true);
  };

  const handlePause = () => {
    console.log("暂停按钮被点击");
    setIsRunning(false);
  };

  const handleReset = () => {
    console.log("重置按钮被点击");
    setIsRunning(false);
    const customMin = parseInt(customMinutes, 10) || 25;
    setTimeInSeconds(customMin * 60);
  };

  const handleCustomTimeChange = (value: string) => {
    console.log("时间输入改变:", value);
    if (value === "") {
      setCustomMinutes("");
      return;
    }
    const num = parseInt(value, 10);
    if (!isNaN(num) && num >= 1 && num <= 120) {
      setCustomMinutes(value);
    }
  };

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;

  console.log("渲染: minutes =", minutes, "seconds =", seconds, "timeInSeconds =", timeInSeconds);

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-card to-muted/50 border-primary/20">
      <div className="flex items-center gap-2 justify-center">
        <Timer className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">番茄钟</h2>
      </div>

      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-6xl font-bold text-primary font-mono w-[72px] text-right">
            {String(Math.max(0, minutes)).padStart(2, "0")[0]}
          </span>
          <span className="text-6xl font-bold text-primary font-mono w-[72px] text-left">
            {String(Math.max(0, minutes)).padStart(2, "0")[1]}
          </span>
          <span className="text-6xl font-bold text-primary font-mono">:</span>
          <span className="text-6xl font-bold text-primary font-mono w-[72px] text-right">
            {String(Math.max(0, seconds)).padStart(2, "0")[0]}
          </span>
          <span className="text-6xl font-bold text-primary font-mono w-[72px] text-left">
            {String(Math.max(0, seconds)).padStart(2, "0")[1]}
          </span>
        </div>
      </div>

      <div className="flex gap-2 items-center justify-center">
        <Input
          type="number"
          value={customMinutes}
          onChange={(e) => handleCustomTimeChange(e.target.value)}
          placeholder="分钟"
          className="w-20 text-center"
          min="1"
          max="120"
          disabled={isRunning}
        />
        <span className="text-muted-foreground">分钟</span>
      </div>

      <div className="flex gap-2 justify-center">
        <Button
          onClick={isRunning ? handlePause : handleStart}
          variant={isRunning ? "secondary" : "default"}
          className="gap-2 w-[90px]"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              <span>暂停</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>开始</span>
            </>
          )}
        </Button>
        <Button onClick={handleReset} variant="outline" className="gap-2">
          <RotateCcw className="w-4 h-4" />
          重置
        </Button>
      </div>
    </Card>
  );
};