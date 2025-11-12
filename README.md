# Superme / 超我

[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-%3E%3D5.0-blue.svg)](https://www.typescriptlang.org/)

🎯 **Task Mystery Box + Pomodoro Timer**  
*Redefining productivity for exploratory minds*

A innovative productivity tool that combines the excitement of random task selection with the proven effectiveness of the Pomodoro technique. Perfect for curious learners, creative thinkers, and anyone who struggles with decision fatigue.

## ✨ Features

### 🎁 Task Mystery Box
- **Random Task Selection** - Get surprise tasks from your predefined pool
- **Reduced Decision Stress** - No more wasting time choosing what to do next
- **Customizable Task Pool** - Add your own tasks and categories
- **Learning Adventure** - Every session becomes an exciting discovery

### ⏱️ Smart Pomodoro Timer
- **25-Minute Focus Sessions** - Scientifically proven optimal focus time
- **Adaptive Breaks** - 5-minute short breaks and 15-minute long breaks
- **Automatic Rotation** - Smart break scheduling every 4 sessions
- **Progress Tracking** - Visualize your productivity patterns

### 🎨 Modern Experience
- **Distraction-Free Interface** - Clean design that keeps you focused
- **Responsive Design** - Works perfectly on desktop and mobile
- **Real-time Updates** - Instant feedback for all interactions
- **Intuitive Controls** - Simple and easy to use

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/xw3981-web/Superme.git
   cd Superme
   ```

2. **Start the Backend Server** (Terminal 1)
   ```bash
   cd backend
   npm install
   npm start
   # Backend running at http://localhost:3000
   ```

3. **Start the Frontend Application** (Terminal 2)
   ```bash
   cd frontend
   npm install
   npm run dev
   # Frontend running at http://localhost:5173
   ```

4. **Access the Application**
   - Open your browser to: `http://localhost:5173`
   - Start your productive adventure!

## 📁 Project Structure

```
Superme/
├── backend/                 # Node.js Backend Service
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies configuration
│   └── tasks.db            # SQLite database (task storage)
└── frontend/               # React Frontend Application
    ├── src/                # Source code directory
    │   ├── components/     # React components
    │   ├── pages/          # Page components
    │   └── utils/          # Utility functions
    ├── public/             # Static assets
    └── package.json        # Frontend dependencies
```

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **SQLite** - Lightweight database for task and progress storage
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework

## 🎯 Core Functionality

### Task Mystery Box System
```javascript
// Example: Random task selection
const surpriseTask = getRandomTask(userTaskPool);
// Returns an exciting learning task from your pool
```

### Intelligent Pomodoro Timer
- 🍅 25-minute focused work sessions
- ☕ 5-minute short breaks
- 🌴 15-minute long breaks (after every 4 pomodoros)
- 🔄 Automatic session cycling

### Data Management
- Local task storage and management
- Progress tracking and statistics
- Session history and insights

## 🎓 Project Vision

**NYUSH VibeCoding Competition Project** - Superme challenges traditional productivity tools by making task management an adventure rather than a chore. We believe productivity should be exciting, not exhausting.

### Problem We Solve
Traditional task managers often feel rigid and overwhelming. Superme transforms productivity into a game-like experience that sparks curiosity and maintains engagement.

## 🤝 Contributing

We love contributions! Here's how you can help:

### Areas for Contribution
- 🐛 **Bug Reports** - Found an issue? Let us know!
- 💡 **Feature Ideas** - Have a cool idea? Share it!
- 📝 **Documentation** - Help us improve docs
- 🔧 **Code Improvements** - Submit pull requests

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/CoolFeature`)
3. Commit your changes (`git commit -m 'Add some CoolFeature'`)
4. Push to the branch (`git push origin feature/CoolFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Turn productivity into an adventure** 🚀  
*Where every task is a surprise and every session is progress*

