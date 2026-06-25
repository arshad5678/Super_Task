# Super Dashboard App

A premium, full-stack personalized productivity dashboard and entertainment discovery hub. Built with a React SPA frontend, an integrated Express.js backend, and a modern TypeScript + TailwindCSS stack.

---

## Key Features

### 1. Multi-Step Onboarding & Validation
* **Step 1: Sign Up**: Real-time form input validation enforcing requirements for Full Name, Username, Email, Mobile number, and password, alongside a Terms and Conditions checkbox.
* **Step 2: Category Selection**: Interactive interest selection supporting **8 specific genres** (Action, Comedy, Drama, Music, Sports, Thriller, Fantasy, Romance). Implements strict selection enforcements where a minimum of **3 categories** is required to continue.
* **Step 3: Profile Review**: Summarized review of registrant details and selected category chips prior to entering the workspace.

### 2. Personalized Super Dashboard
The workspace contains real-time widget modules and productivity tools laid out in a responsive grid:
* **User Profile Card**: Renders user profile information alongside category chips selected during onboarding.
* **Weather Widget**: Dynamically fetches current local details—**Temperature, Humidity, Atmospheric Pressure (hPa), and Wind Speed (m/s)**—integrated with a city search box.
* **News Auto-Rotation Widget**: Displays a single highlighted entertainment article (image, headline title, description text) from GNews, cycling index values every **2 seconds** with memory-safe interval hooks.
* **Interactive Notes Widget**: Supports creation, inline editing, and deletion of text notes. Integrates a **150-character limit counter** and auto-saves to browser `localStorage` on change.
* **Custom Duration Timer**: Replaces fixed duration counters with selectable Hours, Minutes, and Seconds (configured via chevron buttons when paused/reset). Animates circular or linear progress bars, and alerts the user with a pulsing **"TIME'S UP!"** warning overlay and sound chime on countdown completion.

### 3. Movie Discovery & Details Modal
* **Personalized Recommendations**: Fetches recommendations matching the user's selected interests. Features interactive category tabs to toggle movie recommendation lists on the dashboard.
* **Discover Page**: Standalone movies search page allowing genre filtering and keyword queries.
* **Details Modal Overlay**: Clicking on any movie poster opens a blurred background modal detailing runtime, ratings, genre lists, cast members list, and full plot overview.

---

## Technology Stack

* **Frontend**: React 18 + React Router 6 (SPA mode) + Vite + TailwindCSS 3 + TypeScript
* **Backend**: Node.js + Express.js API Server
* **Icons**: Lucide React
* **APIs**: GNews API, OpenWeatherMap API, TMDB API (with local mocks if keys are absent)

---

## Setup & Running Locally

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed on your system.

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=8080
TMDB_API_KEY=your_tmdb_key_here
OPENWEATHER_API_KEY=your_openweather_key_here
GNEWS_API_KEY=your_gnews_key_here
```
*Note: If no API keys are provided, the application automatically falls back to realistic local mock datasets for seamless offline testing.*

### 4. Run Development Server
Spawns both the Vite frontend and Express backend on port `8080`:
```bash
npm run dev
```

### 5. Production Build
```bash
npm run build
npm start
```
