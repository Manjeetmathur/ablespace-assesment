# Full Stack Developer Technical Assessment — Task Management System & AbleSpace Analysis

A full-stack responsive Task Management System built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **shadcn/ui** components, **NestJS REST API**, and **MongoDB**. This project strictly implements the provided Figma designs with high visual fidelity, dynamic themes, guest login session management, and keyboard accessibility.

---

## 🚀 Live Demo & Repository Structure

- **Frontend**: Next.js App Router (`/`, `/tasks`, `/settings`)
- **Backend API**: NestJS REST API (`/backend`)
- **Part 2 Analysis Document**: [`docs/part2-product-analysis.md`](./docs/part2-product-analysis.md)

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, `next-themes`.
- **UI Components**: **shadcn/ui components strictly** (`sidebar`, `card`, `table`, `accordion`, `dialog`, `popover`, `dropdown-menu`, `badge`, `avatar`, `button`, `input`, `kbd`, `tabs`, `switch`, `label`).
- **Backend**: NestJS framework (TypeScript REST API), `@nestjs/mongoose`, DTO validation pipe using `class-validator`.
- **Database**: MongoDB (Mongoose Schemas for `User`, `Task`, `Subtask`, `Comment`, `ActivityLog`).

---

## ✨ Features Implemented (Figma Exact Specifications)

### 1. Page 1 — Login / Landing Page (`/`)
- **Brand Header**: Top-centered **Pyramid** logo pill badge with flame icon.
- **Auth Container Card**: `Let's get back on track` card featuring `Continue as Guest` and `Login with Google` buttons.
- **Guest Authentication**: One-click session initialization connecting to NestJS `POST /api/auth/guest` API.
- **Floating Collaborator Cursors**: Animated background cursor tags (`RUDRA RATHOD`, `_`, `Gup...`).

### 2. Page 2 — Task Management Board & List Views (`/tasks`)
- **Left Sidebar Navigation**: Workspace selector with top `Dexter` profile dropdown.
- **Theme & Color Mode Switcher**:
  - `☀️ Change Theme ▶`: Switch between `Light` and `Dark` themes.
  - `■ Color Mode ▶`: Select accent color swatches (`Amber`, `Blue`, `Pink`, `Rose`, `Emerald`, `Black`) with `localStorage` persistence.
- **Top Bar Actions**:
  - **Search Input**: Real-time search query matching with `⌘F` / `Ctrl+F` keyboard focus listener.
  - **Fields Button**: Field visibility controls.
  - **Filter Dropdown**: Nested submenus for `Status`, `Priority` (`Urgent` 🔴, `High` 🟠, `Medium` 🟡, `Low` ⚪), `Members`, `Due Date`, `Teams`, `Labels`, `Reporter`.
- **Dual View Switcher**:
  - **Kanban Board (`田 Board`)**: Status columns (`To Do`, `Doing`, `Completed`, `On Hold`) with task cards, due date badges, category tags, and inline task creation.
  - **Collapsible List View (`≡ List`)**: Built with `shadcn/ui Accordion` & `Table`, showing collapsible status groups (`▼ To Do`, `▼ Doing`, `▼ Completed`), member avatars, priority badges, and inline `+ Add Task` rows.

### 3. Task Details Page / Inspector Modal
- **Task Header**: Title (`Write API Documentation`), description, lock status, viewers counter (`👁 1`), share, and options.
- **Properties & Resources**: Assignee badge (`A Designer`), due date badge (`📅 31 Jul`), interactive category labels, and attachment input.
- **Subtasks Table**: Collapsible `▼ Subtasks` table with inline subtask creation.
- **Activity & Comments Stream**: Real-time comments feed with reply inputs.
- **Right Details Inspector Panel**: Status picker, Priority dropdown selector, member assignments, and `▼ Updates` timeline audit log.

### 4. Settings / Profile Settings Page (`/settings`)
- **Settings Sidebar**: `← Back to app` button, search, and navigation menu (`Profile`, `Theme`, `Color`).
- **Profile Card**: Editable profile picture, email (`dexter@gmail.com`), full name (`Dexter`), title (`Designer`), and username (`Dexuser`).
- **Workspace Access Card**: `Remove yourself from the workspace` with `Leave Workspace` destructive action button.

### 5. Part 2 — Product Understanding Document
- Detailed breakdown of AbleSpace "Take Data" screen workflow, UX friction points, and actionable design recommendations in [`docs/part2-product-analysis.md`](./docs/part2-product-analysis.md).

---

## 🏃 Getting Started (Local Setup)

### 1. Run Next.js Frontend
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run NestJS Backend (Optional / Connected API)
```bash
cd backend
npm install
npm run start:dev
```
NestJS REST API will run on [http://localhost:4000/api](http://localhost:4000/api).

---

## 🧪 Verification & Build Checks

- **Frontend Compilation**: `npm run build`
- **Backend Compilation**: `cd backend && npm run build`
- **Lint Check**: `npm run lint`
