<div align="center">

# 🚀 NexusGov AI
### Intelligent Crowdsourced Civic Issue Reporting & Resolution Platform

**🏆 Smart India Hackathon 2025 (SIH25031)**

**Problem Statement:** Crowdsourced Civic Issue Reporting and Resolution System

**Client:** Government of Jharkhand

![Java](https://img.shields.io/badge/Java-21-red?style=for-the-badge&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react)
![Flutter](https://img.shields.io/badge/Flutter-Mobile-02569B?style=for-the-badge&logo=flutter)
![License](https://img.shields.io/badge/Status-Development-orange?style=for-the-badge)

</div>

---

# 📖 Overview

NexusGov AI is an AI-powered civic issue reporting platform that enables citizens to report public infrastructure problems such as potholes, garbage dumps, broken streetlights, water leakage, and other civic issues.

The platform uses AI-assisted classification, geolocation, officer dashboards, and real-time status tracking to streamline communication between citizens and government departments.

---

# 🏗️ Project Architecture

```
                    ┌────────────────────┐
                    │   Flutter Mobile   │
                    │   Citizen App      │
                    └─────────┬──────────┘
                              │
                              │ REST API
                              │
                    ┌─────────▼──────────┐
                    │ Spring Boot API    │
                    │ Business Logic     │
                    └─────────┬──────────┘
                              │
              ┌───────────────┼────────────────┐
              │               │                │
              ▼               ▼                ▼
         Local Storage     Database      AI Services

                              ▲
                              │
                    ┌─────────┴─────────┐
                    │ React Dashboard   │
                    │ Officer Portal    │
                    └───────────────────┘
```

---

# 📂 Repository Structure

```
crowdsource/
│
├── backend/
│   ├── Spring Boot REST API
│   ├── Authentication
│   ├── Issue Management
│   ├── Local Image Storage
│   └── Business Logic
│
├── dashboard/
│   ├── React Admin Dashboard
│   ├── Officer Login
│   ├── Analytics
│   └── Issue Monitoring
│
├── mobile/
│   ├── Flutter Citizen App
│   ├── Camera Integration
│   ├── Maps & GPS
│   └── Live Status Tracking
│
└── README.md
```

---

# 🛠️ Tech Stack

| Layer | Technology |
|--------|------------|
| Backend | Java 21, Spring Boot 3 |
| Frontend | React + Vite |
| Mobile | Flutter |
| Database | PostgreSQL *(Planned)* |
| Authentication | JWT |
| AI | Gemini API *(Planned)* |
| Maps | Google Maps API |
| Storage | Local File Storage |

---

# 🚀 Quick Start

## 1️⃣ Clone Repository

```bash
git clone https://github.com/rdjishnu/crowdsource.git
cd crowdsource
```

---

## 2️⃣ Run Backend

```bash
cd backend
mvn spring-boot:run
```

Runs at:

```
http://localhost:8080
```

---

## 3️⃣ Run Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Runs at:

```
http://localhost:3000
```

---

## 4️⃣ Run Flutter App

```bash
cd mobile
flutter pub get
flutter run
```

---

# ✨ Key Features

- 📸 AI-assisted Issue Reporting
- 📍 Live GPS Location Detection
- 🗺️ Interactive Map View
- 📊 Officer Dashboard
- 🔔 Real-time Status Updates
- 📈 Analytics & Reports
- 🧠 AI-based Issue Categorization
- 📷 Image Upload Support
- 🔐 Secure Authentication
- 📱 Cross-platform Mobile App

---

# 👨‍💻 Team Workflow

```
main
│
└── development
      │
      ├── frontend
      ├── backend
      └── mobile
```

All feature development happens through pull requests into the `development` branch before being merged into `main`.

---

# 📌 Project Status

| Module | Status |
|---------|--------|
| Backend | 🟡 In Progress |
| Dashboard | 🟡 In Progress |
| Mobile App | 🟡 In Progress |
| AI Integration | 🔵 Planned |
| Deployment | 🔵 Planned |

---

# 📄 License

This project is developed as part of **Smart India Hackathon 2025 (SIH)**.

---

<div align="center">

### ⭐ If you like this project, consider giving it a star!

Made with ❤️ by Team NexusGov AI

</div>