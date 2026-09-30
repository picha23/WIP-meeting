# WIP Tracker & Report Generator (v2.4)

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646cff.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

A high-velocity personal productivity web application engineered for individual practitioners, senior product designers, tech leads, and managers. **WIP Tracker** streamlines weekly deliverable tracking, blocker escalation, sprint retrospectives, and 1-click formatted meeting report generation for Work-In-Progress (WIP) and standup syncs.

---

## 📸 Key Workspace Views

| View | Purpose & Highlights |
| :--- | :--- |
| **Weekly Deliverables** | Active sprint dashboard with real-time KPI metrics, search filtering, deliverable status cycling (`In Progress` ⇄ `Completed` ⇄ `Blocked`), and quick CRUD forms. |
| **Report Generator** | Real-time markdown standup compiler with presets (*Standard WIP*, *Executive Bullets*, *Tech Slack*, *Client Digest*), modular content toggles, and 1-click clipboard dispatches. |
| **Weekly Sprints Archive** | Historical sprint ledger across quarters (Q3 / Q4), trailing 6-week velocity micro-charts, retrospective notes, and stakeholder contribution analytics. |
| **Blockers & Risks Tracker** | Incident resolution center tracking root cause impediments, escalation assignees, resolution SLAs (with inline sparklines), and SOP escalation playbooks. |

---

## ✨ Features

- **⚡ 1-Click Meeting Dispatch Generator**:
  - Automatically compiles active tasks into structured, executive-ready text.
  - Delivery tones: *Executive / Crisp*, *Tech / Detailed*, and *Casual Standup*.
  - Modular toggles: *Show Blockers First*, *Include Requester/Lead*, *Include Target ETAs*, and *Velocity Metric Badges*.
  - Direct export to **Clipboard**, **Slack Format**, **`.md` Markdown**, and **`.txt` Plain Text**.
  - Local session history for re-copying past dispatches in one click.

- **📊 Comprehensive Sprint Metrics**:
  - Live counters for Total Deliverables, In Progress, Completed, and Blocked & Risks.
  - Proportional animated progress bars and velocity percentage rings.

- **🚫 Incident & Blocker Triage**:
  - Categorization of impediments (*Critical Hard Blocker*, *At Risk / Dependency Pending*, *Resolved*).
  - SLA tracking with average unblocking duration and sparkline visualization.
  - Built-in Standard Operating Procedure (SOP) escalation guide.

- **💾 Offline-First Local Storage Engine**:
  - Zero external server or cloud database required.
  - Automatically persists state in browser `localStorage` / IndexedDB.
  - Storage Manager allows full JSON data backup export and sample reset.

- **🎨 Multi-Theme Design System**:
  - Toggle between **Executive Forest Green** (`#218300`) and **Modern Indigo** (`#4f46e5`) accents.
  - Dense, scannable data layouts built with Tailwind CSS v4 and Google Fonts (*Inter* & *JetBrains Mono*).

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/) with `@tailwindcss/vite`
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/) + Google Material Symbols
- **State & Storage**: Client-side reactive state synced with browser Web Storage

```
wip-tracker/
├── index.html                  # HTML entry point with Inter & JetBrains Mono fonts
├── metadata.json               # Applet capability descriptor
├── package.json                # Project dependencies and npm scripts
├── vite.config.ts              # Vite 8 config with Tailwind v4 plugin
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Root layout, router-like view switcher, and modal state
│   ├── index.css               # Global Tailwind CSS definitions
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces (TaskItem, SprintWeek, BlockerIncident, etc.)
│   ├── utils/
│   │   ├── storage.ts          # LocalStorage persistence, seed data, and storage metrics
│   │   └── reportFormatter.ts  # Markdown & Slack digest compilation engine
│   └── components/
│       ├── Header.tsx                  # Top navigation bar, sprint selector, and theme toggle
│       ├── Sidebar.tsx                 # Navigation drawer with storage engine status
│       ├── WeeklyDeliverablesView.tsx  # F01 & F02: Main tasks dashboard
│       ├── ReportGeneratorView.tsx     # F03: Live report generator and history
│       ├── WeeklySprintsArchiveView.tsx# F04: Historical sprint ledger & analytics
│       ├── BlockersAndRisksView.tsx    # Incident resolution center & SLA metrics
│       ├── Toast.tsx                   # Non-blocking notification feedback
│       └── modals/
│           ├── TaskModal.tsx           # Create / Edit task dialog
│           ├── QuickReportModal.tsx    # Instant 1-click text report dialog
│           ├── LogBlockerModal.tsx     # Log new risk/impediment dialog
│           ├── ExportEscalationModal.tsx# Export markdown escalation brief
│           ├── PlaybookModal.tsx       # Team unblocking SOP guide
│           └── StorageModal.tsx        # Local database backup & reset manager
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or later recommended)
- `npm` or `bun`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/wip-tracker.git
   cd wip-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Run TypeScript lint checks:**
   ```bash
   npm run lint
   ```

---

## 📋 Evaluation & Testing Checklist (from PRD)

| Ref | Test Scenario | Status |
| :--- | :--- | :--- |
| **TC01** | Create a deliverable with all valid fields and check dashboard display | ✅ Passed |
| **TC02** | Attempt to save task without Job Name or Requester; verify inline validation error | ✅ Passed |
| **TC03** | Generate report with active tasks; verify grouping by Completed, In Progress, Blocked | ✅ Passed |
| **TC04** | Click "Copy to Clipboard" and verify clipboard content matches report text | ✅ Passed |
| **TC05** | Refresh browser; verify browser storage retains all task records | ✅ Passed |
| **TC06** | Switch sprint weeks and verify tasks are correctly partitioned | ✅ Passed |

---

## 📄 License

This project is licensed under the Apache 2.0 License - see the LICENSE file for details.
