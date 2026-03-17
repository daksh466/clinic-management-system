# Clinic Management System - Full Cloud Deployment Guide (Render + Netlify)

## 🎯 Prerequisites
- GitHub account
- Render.com account (free tier OK)
- Netlify.com account (free)

## 1. Backend Deployment (Render - 5 minutes)

1. **Prepare Backend** (already done):
   - `PORT = process.env.PORT || 5000`
   - `"start": "node server.js"`
   - SQLite auto-init
   - CORS enabled

2. **Push to GitHub**:
   ```
   git add .
   git commit -m "Deploy ready"
   git push origin main
   ```

3. **Deploy on Render**:
   - render.com → New → Web Service → Connect GitHub repo
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
  - **Env Var**: `FRONTEND_URLS=https://your-frontend.netlify.app,https://your-other-frontend.com` (comma-separated, add after frontend deploy)
   - Deploy → Get **BACKEND_URL** e.g. `https://clinic-backend-xyz.onrender.com`

4. **Test Backend**:
   ```
   curl https://YOUR_BACKEND_URL/health
   # {"status":"OK", "db":"connected"}
   ```

**Note**: Free tier sleeps after 15min inactivity (30s cold start). Upgrade to Pro ($7/mo) for always-on.

## 2. Frontend Deployment (Netlify - 2 minutes)

1. **Update API_URL** (one-time manual):
   - Open `frontend/js/script.js`
   - Replace `https://YOUR_BACKEND_URL/api` with your Render URL e.g. `https://clinic-backend-xyz.onrender.com/api`
   - Save

2. **Deploy**:
   - netlify.com → Sites → "Deploy site" → Drag entire `clinic-management-system/frontend/` folder
   - **Site Settings → Page not found / 404 → Site root redirect**: `/dashboard.html`
   - Get **FRONTEND_URL** e.g. `https://amazing-clinic.netlify.app`

3. **Connect Backend** (add to Render env):
   - Render dashboard → Environment → `FRONTEND_URL=https://amazing-clinic.netlify.app`
   - Redeploy backend

4. **Test Full Stack**:
   - Visit `https://amazing-clinic.netlify.app/dashboard.html`
   - Dashboard loads patients, medicines, reminders
   - Add patient → Verify in backend `curl https://YOUR_BACKEND_URL/api/patients`

## 🚀 Complete Flow
```
GitHub Repo → Render (backend) → BACKEND_URL
                 ↓ Update script.js
frontend/ → Netlify (static) → FRONTEND_URL
                 ↓ Add to Render env
Fully Deployed Public Clinic System ✅
```

## 📋 Production Checklist
- [ ] Backend Render URL working (`/health`)
- [ ] Frontend loads dashboard (no CORS errors)
- [ ] Add patient works end-to-end
- [ ] Update Render `FRONTEND_URLS` (comma-separated origins)
- [ ] Custom domain (optional)

## ⚠️ Limitations & Upgrades
- **SQLite Data Loss**: Free Render ephemeral disk → Data resets on restart. Upgrade: Render Postgres + code migration
- **Cold Starts**: Free tier 30s delay → Ping service or Pro plan
- **Scale**: Railway/Vercel alternatives similar

## Demo Commands
```bash
# Backend test
curl https://YOUR_BACKEND_URL/api/patients

# Frontend (local before deploy)
start frontend/dashboard.html  # Windows
open frontend/dashboard.html   # Mac
```

**Live anywhere, anytime!** 🎉

**Updated**: API_URL placeholder, dashboard.html entry, Render/Netlify exact steps.

