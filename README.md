# GRAM-SETU: Verified Village Credit Exchange

**GRAM-SETU** is an offline-first, AI-assisted platform designed to bridge the credit gap between rural micro-enterprises (SHGs, MSMEs) and formal banking institutions. It empowers Field Officers to track, verify, and grade financial resilience at the village level, ultimately automating bank credit linkage appraisals.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Ready-blue.svg)

---

## 🌟 Key Features

- **Offline-First Data Sync**: Field officers can log ledger entries offline. Background Service Workers and IndexedDB automatically cache the data and securely sync it to the cloud when an internet connection is restored.
- **AI-Powered Risk Alerts**: Text-to-speech enabled risk alerts provide accessible financial advice and cash flow warnings for rural enterprises (e.g. Dairy, Poultry, Retail).
- **Enterprise Dashboard**: A clean, accessible view for enterprise owners to monitor their cash flow, resilience score, and risk bands.
- **Field Officer Console**: Track, review, and filter portfolios of Self Help Groups (SHGs) and businesses across assigned villages.
- **Automated Credit Readiness**: Aggregate village pooled corpus and instantly generate a Bank Appraisal Packet for NABARD grading and formal credit linkage.

---

## 🏗️ Tech Stack

- **Frontend**: HTML5, Vanilla JavaScript, TailwindCSS, Service Workers (PWA offline sync).
- **Backend**: Node.js, Express.js.
- **Database**: PostgreSQL (pg pool), configured for secure remote connections.
- **Security**: JWT-based session management, bcrypt password hashing, helmet, and CORS.

---

## 🚀 Deployment (Render.com)

GRAM-SETU is pre-configured for simple deployment on [Render](https://render.com).

1. **Database**: Create a new PostgreSQL database on Render. Copy the provided `Internal Database URL`.
2. **Web Service**: Deploy this repository as a new Web Service.
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. **Environment Variables**: Add the following to your Render Web Service:
   - `DATABASE_URL`: Your Render PostgreSQL URL
   - `JWT_SECRET`: A secure, long random string for authentication tokens.

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/prathmesh1251050291-star/GRAM-SETU-Verified-Village-Credit-Exchange.git
cd GRAM-SETU-Verified-Village-Credit-Exchange/backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env` file in the `backend/` directory:
```env
PORT=5000

# Database Configuration (Local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=root
DB_NAME=gram_setu

# Or use a single connection string:
# DATABASE_URL=postgres://postgres:root@localhost:5432/gram_setu

JWT_SECRET=supersecretkey
NODE_ENV=development
```

### 4. Initialize Database
Execute the SQL script located at `Database/schema.sql` in your PostgreSQL instance to create the necessary tables (`users`, `sessions`, etc.).

### 5. Start the Server
```bash
npm run dev
```
The application will be running at `http://localhost:5000`.

---

## 📂 Project Structure

```
GRAM-SETU/
│
├── backend/
│   ├── routes/          # API Routes (Auth, Sync)
│   ├── db.js            # PostgreSQL Connection Pool
│   ├── server.js        # Express Server & Static File routing
│   └── package.json     
│
├── frontend/
│   ├── public/          # HTML Views (Dashboard, Login, Signup)
│   ├── offlineSync.js   # IndexedDB & Background Sync Logic
│   ├── service-worker.js# PWA Service Worker
│   └── css/             # Stylesheets
│
├── Database/
│   └── schema.sql       # SQL Table Definitions
│
└── README.md
```

---
*Built to accelerate financial inclusion and resilience for rural enterprises.*
