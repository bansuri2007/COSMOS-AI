# Pip — AI-Powered Desktop Learning Companion (Windows Electron App)

Pip is an animated, intelligent AI character that lives on the Windows desktop, floats above other applications (VS Code, Chrome, PDFs, etc.), moves around the screen, talks to the user through speech bubbles, and coaches the student through the **PathPilot AI** learning platform.

---

## Architecture & Technology

- **Desktop Framework**: Electron for Windows desktop application (Frameless, transparent, `alwaysOnTop: true`, system tray integration, single instance lock).
- **Frontend / Renderer**: React 19 + TypeScript + Vite + Tailwind CSS.
- **Character Animation Engine**: CSS keyframes & SVG 3D-styled robotic mascot with 9 expressive emotional states:
  1. `idle`: blinking LED eyes, soft breathing, floating hover.
  2. `walking`: swinging legs and arms synchronized with roaming coordinates.
  3. `welcome`: friendly arm wave.
  4. `thinking`: looking up, glowing indigo antenna, thinking indicator.
  5. `explaining`: pointing arm toward message, speaking mouth.
  6. `studying`: holding glowing holographic book.
  7. `encouraging`: warm supportive expression.
  8. `celebrating`: victory jump, sparkles, confetti.
  9. `sleeping`: low-distraction quiet mode.
- **Backend AI Integration**: Server-side Gemini 3.8 Flash (`gemini-3.8-flash`) endpoints with `@google/genai` for study planning, doubt clearing, and PYQ analysis.
- **Security**: Strict Electron security:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - `sandbox: true`
  - Whitelisted IPC channels via preload script (`electron/preload.js`).

---

## Quick Start & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Full-Stack Dev Server (Express + Vite)
```bash
npm run dev
```
The app will run at `http://localhost:3000`.

### 3. Launch Native Windows Electron Companion Window
In a second terminal window:
```bash
npx electron electron/main.js
```
Pip will immediately appear as a transparent, always-on-top floating desktop companion on your Windows monitor!

---

## Packaging for Windows (.exe & NSIS Installer)

To compile and package the standalone Windows executable:

```bash
# 1. Build the production React web bundle
npm run build

# 2. Package into Windows 64-bit installer and portable executable
npx electron-builder --win
```

The output executables will be placed in the `release/` directory:
- `release/Pip — AI Desktop Learning Companion Setup.exe` (NSIS Installer with desktop and start menu shortcuts)
- `release/Pip — AI Desktop Learning Companion.exe` (Portable zero-install executable)

---

## Features Included

1. **Streak & Daily Goal Tracking**: Daily streak counter, level progress, XP milestones.
2. **Flashcards System**: Interactive 3D flip flashcards with Spaced Repetition System (SRS: Again, Hard, Good, Easy) and custom card creator.
3. **Personalised AI Study Planner**: Tailors short, adaptive study roadmaps based on goal, current knowledge, and quiz performance.
4. **Doubt Clearing AI**: Socratic coach breaking down complex technical concepts into intuitions, analogies, and pitfall warnings.
5. **PYQ Analyser**: Analyzes past year exam questions, calculates topic weightage, auto-generates diagnostic practice quizzes, remedial flashcards, and priority todo lists.
6. **Lock Screen Focus (Pomodoro)**: 25-minute focus sprints, distraction-free overlay, ambient sound generator (40Hz Gamma wave, Rain, White noise), and task pinning.
7. **Weekly Timetable Integration**: Schedule study blocks, lecture times, and synchronized Pip reminders.
8. **Upload Module & YouTube Link Ingestion**: Summarizes video lectures and transcripts into study guides and flashcards.
9. **Breaks & Wellness Hub**: Spotify Lo-Fi study music embed, motivation shorts, and 60-second foreign language sprints.
10. **PathPilot AI Platform Integration**: Live embedded preview and data sync bridge for `https://learnova-intelligent-learning-classroom-ecosystem.ai.studio`.
11. **Student Leaderboard & Accessibility Suite**: Dyslexia-friendly font mode, high contrast, text-to-speech, reduced motion, and character scaling.
