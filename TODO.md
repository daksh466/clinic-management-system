# Clinic Management System - Deployment TODO

## ✅ Backend (Render)
- [x] CORS configured for Netlify
- [ ] Deploy to Render: https://clinic-management-system-1dy2.onrender.com
- [ ] Test endpoints: /health, /api/patients, /api/medicines/low-stock

## ✅ Frontend (Netlify) 
- [x] API paths fixed (/api prefix)
- [x] Production API_URL set
- [ ] Netlify Settings:
  | Setting | Value |
  |---------|-------|
  | Base directory | `/` |
  | Build command | `(empty)` |
  | Publish directory | `frontend` |
- [ ] Deploy & test connection

## 🔄 Testing
1. Visit Netlify URL → Check dashboard loads data
2. Console → No CORS/fetch errors
3. Add patient/medicine → Backend updates
4. Backend logs → Requests from Netlify origin

## 📋 Commands
```bash
# Backend local test
cd clinic-management-system/backend
npm install
npm start
# Test: curl http://localhost:5000/health

# Frontend serve (local)
npx serve clinic-management-system/frontend
```

**Status: Ready for deployment!**

