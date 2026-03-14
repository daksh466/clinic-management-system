# Ayurvedic Clinic Management System 🏥

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
✅ Backend Render-ready (PORT, CORS, SQLite auto-init)  
✅ Frontend static (Netlify drag-drop, dashboard entry)  
✅ API_URL placeholder in script.js (replace post-deploy)  
✅ Detailed deployment instructions  

**Live Demo Ready!** Deploy and access from any device.

## Next (Optional)
- Postgres for persistent data
- Patient edit forms
- Authentication
- CSV export
- SMS reminders

**Production Deployed & Accessible via Public URLs! 🎉**

