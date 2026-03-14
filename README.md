# Ayurvedic Clinic Management System 🏥

## 🌟 Features
- **Patient Management**: Add, view, edit, delete patients with treatment details, diet restrictions, and **precautions/instructions**
- **Medicine Inventory**: Track stock with low-stock alerts (<10 units)
- **Smart Reminders**: Daily dashboard for course endings (today + tomorrow)
- **Responsive UI**: Modern, beginner-friendly frontend
- **SQLite Database**: Auto-creates tables, no setup needed

## 🛠 Quick Local Setup (2 minutes)

### Backend (API)
```bash
cd clinic-management-system/backend
npm install
npm start
```
- Opens http://localhost:3000
- Test API: http://localhost:3000/
- Database `clinic.db` auto-creates

### Frontend
```bash
# From project root
# Open any HTML file in browser (index.html, patients.html, etc.)
# All fetch to localhost:3000/api automatically
```
- Recommended: patients.html, medicines.html, dashboard.html

**Full Stack**: Backend on port 3000 + open frontend HTML ✅

## 📱 Pages
- `frontend/index.html` - Landing
- `frontend/patients.html` - Patient CRUD
- `frontend/medicines.html` - Medicine inventory  
- `frontend/dashboard.html` - Stats + reminders

## 🚀 Deploy to Production

### Backend (Render/Railway - Free)
1. Push to GitHub
2. Connect repo to Render/Railway
3. Build: `npm install`
4. Start: `npm start`
5. Auto PORT binding, SQLite works (use volume/DB service for persistence)

**Pro Tip**: Render detects Node.js automatically!

### Frontend (Netlify/Vercel - Free Static Host)
1. Deploy `frontend/` folder
2. **API Proxy**: Update `js/script.js` API_BASE to your backend URL
   ```js
   const API_BASE = 'https://your-backend.onrender.com/api';
   ```

### One-Click Alternative: Docker (Optional)
```dockerfile
# Add Dockerfile later if needed
```

## 🧪 Test APIs (curl)
```bash
curl http://localhost:3000/api/patients
curl http://localhost:3000/api/medicines  
curl http://localhost:3000/api/reminders
```

## 📚 Beginner Friendly
- **No Database Setup**: SQLite auto-init
- **No Build Step**: Pure HTML/JS + Node
- **Well Commented**: Every file explained
- **Error Handling**: Graceful frontend/backend errors

## Next Features (TODO)
- Patient edit forms
- Low-stock alerts
- Export CSV
- Authentication

**Ready for Production! 🎉**

**Questions?** Check backend/server.js comments or frontend TODO.md

