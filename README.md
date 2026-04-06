# FinanceFlow Dashbaord

A modern, high-performance Finance Dashboard built for the Frontend Developer Intern Assignment. This project demonstrates advanced React patterns, premium UI/UX design with Vanilla CSS, and Role-Based Access Control (RBAC) simulation.

## 🚀 Live Demo
*(Assuming local run)*: `http://localhost:5173`

## ✨ Features

### 1. Dashboard Overview
- **Summary Cards**: Real-time calculation of Total Balance, Monthly Income, and Monthly Expenses.
- **Visualizations**: 
  - **Balance Trend**: An interactive Area Chart (Recharts) showing wealth growth over time.
  - **Spending Breakdown**: A Pie Chart showcasing categorical spending distribution.

### 2. Transaction Management
- **Interactive List**: View date, amount, category, and type (Income/Expense).
- **Search & Filter**: Real-time search by description/category and filtering by transaction type.
- **Admin Controls**: Add and delete transactions (requires Admin role).

### 3. Role-Based UI (RBAC)
- **Role Switcher**: Toggle between **Admin** and **Viewer** roles in the sidebar.
- **Dynamic Behavior**: 
  - **Admin**: Can create and delete transactions.
  - **Viewer**: Read-only access; action buttons and modals are hidden.

### 4. Smart Insights
- Automatic calculation of the **Highest Spending Category**.
- **Savings Ratio** calculation based on income vs. balance.
- Contextual alerts for upcoming events.

### 5. Premium UI/UX
- **Aesthetics**: Glassmorphic elements, vibrant color palette, and modern typography (Outfit via Google Fonts).
- **Animations**: Smooth entry/exit animations and layout transitions using `framer-motion`.
- **Dark/Light Mode**: Seamlessly toggle between themes.
- **Responsiveness**: Fully responsive grid layout for different screen sizes.

---

## 🛠️ Technical Stack
- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (CSS Variables, Glassmorphism)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion
- **State Management**: React `useState` & `useMemo` (optimized for performance)

---

## 📦 Setup & Installation

1. **Clone/Navigate to the directory**:
   ```bash
   cd "Finance Dashboard"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run Dev Server**:
   ```bash
   npm run dev
   ```

## 🧠 Approach & Philosophy
The goal was to create a dashboard that feels "alive" and premium rather than a static table. I focused on:
- **State Optimization**: Using `useMemo` to ensure stats and filters are only re-calculated when necessary.
- **Design Consistency**: Using a centralized CSS variable system for easy maintenance.
- **Accessibility**: High contrast ratios and clear typography.

---

*Submitted for Frontend Developer Intern Assignment*
