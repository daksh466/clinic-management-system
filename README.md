# Ayurvedic Clinic Management System 🏥
# Production-Grade SaaS Clinic Management System

## Architecture
Backend: Node.js, Express, PostgreSQL, Sequelize ORM, JWT Auth, Winston Logging, Docker, CI/CD
Frontend: Modular JS, Central API client, Responsive UI, Toasts, Loading indicators

## Installation
1. Clone repo
2. Run `docker-compose up` for full stack (backend + PostgreSQL)
3. Or run backend: `cd backend && npm install && npm start`
4. Or run frontend: open `frontend/index.html` or deploy to Netlify

## Development
- Backend: `backend/server.js`, modular structure in `backend/src/`
- Frontend: modular JS in `frontend/js/`
- Environment: `.env` for secrets, DB config
- Run tests: (add tests in backend/tests/)

## Deployment
- Backend: Dockerfile, Render, Railway, or any Docker host
- Frontend: Netlify, Vercel, or static hosting
- CI/CD: GitHub Actions workflow in `.github/workflows/ci.yml`

## Features
- Modular backend (controllers, services, routes, middleware)
- Centralized error handling, request logging, validation
- Health endpoint `/health` with uptime, memory, CPU
- PostgreSQL with normalized tables: Clinics, Doctors, Patients, Medicines, Reminders, Visits, Users
- JWT authentication, role-based access (admin, doctor, assistant)
- Multi-clinic SaaS: clinic_id in all tables, data isolation
- CORS, API caching, rate limiting, gzip compression
- Winston logging, error logs in `backend/logs/error.log`
- Monitoring: health, uptime, metrics
- Frontend: modular JS, central API client, retry logic, smart API URL detection
- Responsive UI, loading indicators, toast notifications


## 🌟 Features
- **Patient Management**: Add, view, delete patients with treatment details, diet (parhej), precautions
- **Medicine Inventory**: Track stock, low-stock alerts, expiry dates
- **Smart Reminders**: Dashboard shows patients ending course today/tomorrow
- **Search & Reports**: Patient search, monthly reports, disease insights
- **Fully Deployable**: Render backend + Netlify frontend (public URLs)
- **SQLite Auto-setup**: No DB config needed

## 🚀 Production Deployment (5 minutes)

**Backend (Render)**:
```
1. Push to GitHub
2. render.com → Web Service → backend/ dir
3. Build: `npm install` | Start: `npm start`
4. Get BACKEND_URL
```

**Frontend (Netlify)**:
```
1. Edit frontend/js/script.js → YOUR_BACKEND_URL
2. Drag frontend/ to netlify.com
3. Set 404 redirect to /dashboard.html
4. Get FRONTEND_URL
```

**Connect**:
```
Render Env: FRONTEND_URL=your-netlify-url
```

**Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)

## 🛠 Local Setup (1 minute)
```bash
cd backend && npm install && npm start  # http://localhost:5000
# Open frontend/dashboard.html in browser
```

## 📱 Demo Pages
| Page | URL | Features |
|------|-----|----------|
| Dashboard | `frontend/dashboard.html` | Stats, reminders, insights |
| Patients | `frontend/patients.html` | CRUD, search, reports |
| Medicines | `frontend/medicines.html` | Inventory, low-stock |
| Landing | `frontend/index.html` | Nav |

## 🔧 APIs
```
GET /api/patients           # All patients
POST /api/patients          # Add patient
DELETE /api/patients/:id
GET /api/medicines          # All + low_stock flag
GET /api/medicines/low-stock
GET /api/reminders          # Today + tomorrow
GET /api/patients/search    # By name/phone/disease
GET /api/patients/reports/* # Monthly, insights
/health                     # Status check
```

## 📊 Current Status
✅ Production backend (PostgreSQL, Docker, CI/CD, modular)
✅ Modular frontend (responsive, API client, UI utilities)
✅ API_URL auto-detection, CORS, caching, rate limiting
✅ Health endpoint, monitoring, error logging
✅ Full deployment guide

**Ready for commercial SaaS deployment!**

