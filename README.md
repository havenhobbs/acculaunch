# Acculaunch

[![Live Demo](https://img.shields.io)](https://vercel.app)
[![API Status](https://img.shields.io)](https://onrender.com)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![Node.js](https://img.shields.io/badge/node-18+-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![GitHub last commit](https://img.shields.io/github/last-commit/havenhobbs/acculaunch)

**Acculaunch** is a full-stack flight readiness tracking dashboard built to evaluate real-time meteorological conditions against strict strucutral mission constraints. 

This application pairs a Python/Flask backend API with a React + Vite frontend dashboard to display weather metrics and launch go/no-go status for predefined launch sites. 

## Live Demonstration & Core Features

* [Click here to view the live deployment hosted on Vercel & Render] (https://acculaunch.vercel.app) *

* **Dynamic Constraint Verification:** Cross-checks active wind vectors, visibilirt bounds, wind shear ratios, and localized precipitation values against baseline mission thresholds. 
* **Asynchronous Serialization:** Leverages automated background endpoints to efficiently pipe third-party mapping telemetry down to frontend hooks.
* **Geographic Modular Filtering:** Instantly updates complete historical forecasts and analytics grids via clean custom coordinate drop-down selectors.

## System Architecture & Technology Stack

**Frontend** | React 18, Vite, JavaScript | Component-driven interface design, state management, and real-time interface rendering.
**Backend API Server** | Python 3.10, Flask, Flask-CORS | Handles third-party OpenWeatherMap API routing, data serialization, and status calculations.
**Automation Environment** | Python-Dotenv, Requests, Gunicorn | Secure environment configuration management and production server initialization. 
**DevOps & Cloud Hosting** | Vercel Edge, Render Hosting | Decoupled continuous integration pipelines for instantaneous build deployments.

---

## Exposed REST API Endpoints

The Flask engine provides clean JSON routing endpoints utilized directly by the frontend service layers: 
*   `GET /api/weather` - Fetches current raw weather metrics based on target geographical markers.
*   `GET /api/forecast` - Restructures interval weather prediction sequences for advanced analysis.
*   `GET /api/launch/status` - Processes business rules against environmental criteria to yield final Go/No-Go decisions.
*   `GET /api/settings` - Returns the current configuration parameters and active safety metrics.

---

## Local Quick Start Guide 

Follow these steps to get Acculaunch running locally:

### 1. Clone the Repository
```bash
git clone https://github.com/CPSC4910-Team-4/acculaunch.git
cd acculaunch
```
### 2. Backend Setup
```bash
python -m venv venv                 #create virtual environment
# activate venv
# Windows (Powershell): venv\Scripts\Activate
# Windows (Cmd): venv\Scripts\activate.bat
# macOS/Linux: source venv/bin/activate

pip install -r requirements.txt     #install dependencies
copy .env.example   .env            #Windows
cp .env.example     .env            #macOS/Linux
# edit .env to set your OPENWEATHER_API_KEY
python weather.py                   #start backend server
```
### 3. Frontend Setup
```bash
npm install         #install Node dependencies
npm run dev         #start Vite dev server
```
### 4. Access the Dashboard
- Open a browser at: `http://localhost:5173`
- Select a Launch Site from the dropdown
- View current weather, forecast, and launch go/no-go status      


---

## Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Using the Application](#using-the-application)
- [Troubleshooting](#troubleshooting)
- [Summary Checklist](#summary-checklist)

---

## Overview

AccuLaunch consists of two main parts:

1. **Backend API (Flask)**
    - File: `weather.py`
    - Calls the OpenWeatherMap API
    - Exposes endpoints: 
        - `/api/weather`
        - `/api/forecast`
        - `/api/launch/status`
        - `/api/settings`

2. **Frontend Dashboard (React + Vite)**
    - Source: `src/` directory
    - Calls the Flask API at `http://127.0.0.1:5000`
    - Displays weather data and launch readiness for predefined sites

**Testing Ports**
- Flask Backend: **5000**
- Vite Dev Server: **5173**

---

## System Requirements

- **Python 3.9+** (3.10+ recommended)
- **Node.js 18+** (npm included)
- **Git** (optional, if cloning from a repo)
- **Modern Web Browser** (Chrome, Edge, Firefox, etc.)
- **OpenWeatherMap API key** (free from [openweathermap.org](https://openweathermap.org))

---

## Project Structure

```text
weather.py                              #Flask backend server
requirements.txt                        #Python dependencies
.env.example                            #Environment variables template
settings.json                           #Mission thresholds & date
package.json                            #Frontend dependencies
vite.config.js                          #Vite configuration
index.html                              #React entry HTML
src/
   ├─main.jsx
   ├─App.jsx
   ├─pages                              #Dashboard, Forecast, About
   ├─services/weather_service.js        #API Calls
   └─constants/locations.jsx            #Pre-defined Launch Sites
```

---

## Backend Setup

1. Navigate to Project Root
   ```bash
   cd path/to/acculaunch-main
   ```
2. Create and Activate Virtual Environment
    - Windows (Powershell)
        ```bash
        python -m venv venv
        venv\Scripts\Activate
        ```
    - Windows (Command Prompt)
       ```bash
       python -m venv venv
       venv\Scripts\activate.bat
       ```
    - macOS/Linux
       ```bash
       python3 -m venv venv
       venv/bin/activate
       ```

3. Install Dependencies
    ```bash
    pip install -r requirements.txt
    ```

4. Configure Environment Variables
    - Windows
        ```bash
        copy .env.example .env
        ```
    - macOS
        ```bash
        cp .env.example .env
        ```
    Edit .env 
    ```env
    OPENWEATHER_API_KEY=your_api_key_here
    ```
5. Run the Backend
    - Windows
        ```bash
        python weather.py
        ```

    - macOS
        ```bash
        python weather.py
        ```
    
    Verify Endpoints:
    - `/api/weather?lat=...&lon=...`
    - `/api/forecast?lat=...&lon=...`
    - `/api/launch/status?lat=...&lon=...`
    - `/api/settings`

---

## Frontend Setup

1. Install Node Dependencies
    ```bash
    npm install
    ```
2. Start Vite Dev Server
    ```bash
    npm run dev
    ```
3. Access the Dashboard
    - Open browser at `http://localhost:5173`
    - Navigate between Dashboard, Forecast, About
    - Select Launch Sites to see current weather, forecast, and go/no-go status

---

## Using the Application

- Choose a launch site via the dropdown (e.g., Summit Baseball Fields, Blue Grass Rocket Society, Woodville)

- Dashboard shows: wind average, gust, wind shear, visibility, rain, humidity

- Forecast shows multi-time interval weather predicitions for the Dashboard criteria


---

## Troubleshooting

- Frontend stuck on "Loading..."
    - Backend not running
    - API key missing
    - Port conflict

- Python Module Errors
    - Ensure venv is activated
    - Ensure `pip install -r requirements.txt` ran successsfully

- Port Conflicts (if necessary)
    - Change Flask (`weather.py`) port
    - Change Vite (`package.json`) port
    
- Location Changes
    - Update `src/constants/locations.jsx`
    - Hot-reload frontend

---

## Summary Checklist

### Backend
```bash
cd project_root
python -m venv venv
#activate venv
pip install -r requirements.txt
#configure .env with api key
python weather.py
```

### Frontend
```bash
npm install

npm run dev
```

### Test

- Open `http::/localhost:5173`
- Switch locations, verify weather, forecast, and launch status

    
