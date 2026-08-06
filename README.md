# NexusGov AI - SIH 2025 (SIH25031)

**Crowdsourced Civic Issue Reporting and Resolution System**  
Client: **Government of Jharkhand**

---

## 📁 Repository Modules

- [**`backend/`**](file:///Users/rdjishnupriyan/Documents/crowdsource/backend) - Spring Boot 3 Java 21 REST API & Local Photo Storage (`port 8080`)
- [**`dashboard/`**](file:///Users/rdjishnupriyan/Documents/crowdsource/dashboard) - React Officer Operations Control Panel (`port 3000`)
- [**`mobile/`**](file:///Users/rdjishnupriyan/Documents/crowdsource/mobile) - Flutter Citizen App & Geo Map Navigation

---

## ⚡ Quick Start Commands

### 1. Launch React Dashboard Web UI
```bash
cd dashboard
npm run dev
```
Open **`http://localhost:3000/`** in your browser.

### 2. Launch Spring Boot REST API
```bash
cd backend
mvn spring-boot:run
```
API running on **`http://localhost:8080/api/v1/issues`**.

### 3. Launch Flutter Citizen App
```bash
cd mobile
flutter run
```
