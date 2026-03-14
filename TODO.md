# Clinic Management System Deployment Preparation - TODO

## Plan Breakdown (Approved)

**Step 1: Update frontend/js/script.js** ☑️
- Replace `API_BASE = window.BACKEND_URL || 'http://localhost:5000/api'` with `const API_URL = "https://YOUR_BACKEND_URL/api";`
- Rename all `API_BASE` to `API_URL` in fetches (patients, medicines, reminders, reports)

**Step 2: Update DEPLOYMENT.md** ☑️
- Create comprehensive deployment instructions for Render + Netlify
- Include backend deploy steps, URL replacement, Netlify drag-drop with dashboard.html as index

**Step 3: Update README.md** ☑️
- Add deployment quick-start section with links to instructions

**Step 4: Verify backend** ☑️ (No changes needed - searches confirmed PORT/CORS/scripts/routes/DB)

**Step 5: Test locally** (Post-edits)
- Backend: `cd backend && npm start`
- Frontend: Update placeholder, open dashboard.html, verify fetches

**Step 6: Complete** ⏳
- attempt_completion with deploy commands/demo

**Progress:** Backend verified. Proceeding with frontend/docs updates.

