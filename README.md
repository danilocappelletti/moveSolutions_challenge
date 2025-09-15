# IoT Sensors Dashboard - MoveSolutions Challenge

## 🛠 Tech Stack

- **Vue 3** with Composition API and `<script setup>`
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Plotly.js** for interactive charts
- **Pinia** for state management
- **Vite** for build tooling

## 📋 Prerequisites

- **Node.js**: v22.19.0 or compatible version
- **npm**: Latest version


## 🚦 Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd MoveChallenge/iot-sensors-dashboard
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## ⏱️ Live Data Simulation

I saw based on the data provided that sensors typically collect data every **45 minutes**. However, for demonstration purposes, this dashboard updates every **10 seconds** to showcase the live data feature. Same goes for the auto update feature that will add a value like 45 minutes passed but it's only to not break the chart main logic.

### Styling
- Tailwind CSS classes throughout components
- Component-scoped styles where needed



