# Deployment Guide — SCMS (MongoDB Atlas + Online Backend)

This guide walks you through deploying the backend online with **MongoDB Atlas** and connecting the React frontend.

---

## Step 1: MongoDB Atlas Setup

1. Go to [https://www.mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free account.
2. Click **Build a Database** → choose **M0 Free** tier.
3. Choose a cloud region close to you → **Create Cluster**.

### Database User
1. Go to **Database Access** → **Add New Database User**
2. Authentication: **Password**
3. Username: e.g. `scmsadmin`
4. Password: generate a strong password and **save it**
5. Role: **Atlas admin** (or **Read and write to any database**)
6. Click **Add User**

### Network Access
1. Go to **Network Access** → **Add IP Address**
2. For development: click **Allow Access from Anywhere** (`0.0.0.0/0`)
3. Click **Confirm**

### Get Connection String
1. Go to **Database** → **Connect** → **Drivers**
2. Copy the connection string:

```
mongodb+srv://scmsadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

3. Replace `<password>` with your actual password (URL-encode special characters like `@` → `%40`)
4. Add database name before `?`:

```
mongodb+srv://scmsadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/student_course_management?retryWrites=true&w=majority
```

---

## Step 2: Test Atlas Locally First

Edit `backend/.env`:

```env
PORT=5000
HOST=0.0.0.0
MONGO_URI=mongodb+srv://scmsadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/student_course_management?retryWrites=true&w=majority
JWT_SECRET=your_long_random_secret_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

Run:

```bash
cd backend
npm run seed
npm run dev
```

If seed succeeds, Atlas is connected.

---

## Step 3: Deploy Backend to Render (Free)

1. Push your project to **GitHub** (do not commit `.env` files).
2. Go to [https://render.com](https://render.com) → Sign up → **New +** → **Web Service**
3. Connect your GitHub repo.
4. Configure:

| Setting | Value |
|---------|-------|
| Name | `scms-backend` |
| Root Directory | `backend` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

5. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `HOST` | `0.0.0.0` |
| `MONGO_URI` | Your Atlas connection string |
| `JWT_SECRET` | Long random string (32+ chars) |
| `JWT_EXPIRE` | `7d` |
| `CLIENT_URL` | `http://localhost:3000` (update after frontend deploy) |

6. Click **Create Web Service** and wait for deploy.
7. Your backend URL will be like: `https://scms-backend.onrender.com`
8. Test: open `https://scms-backend.onrender.com/api/health`

### Seed Production Database

In Render dashboard → your service → **Shell**:

```bash
npm run seed
```

This creates admin, students, and courses in Atlas.

---

## Step 4: Deploy Frontend (Netlify or Vercel)

### Option A: Netlify

1. Go to [https://netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
2. Connect GitHub repo
3. Build settings (auto-detected from `netlify.toml`):
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/build`
4. Add environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://scms-backend.onrender.com/api` |

5. Deploy. Your site URL: `https://your-app.netlify.app`

### Option B: Vercel

1. Go to [https://vercel.com](https://vercel.com) → Import GitHub repo
2. Set root directory to `frontend`
3. Add environment variable:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://scms-backend.onrender.com/api` |

4. Deploy.

---

## Step 5: Connect Frontend ↔ Backend (CORS)

After frontend is deployed, update **Render backend** environment variable:

```
CLIENT_URL=https://your-app.netlify.app
```

For multiple URLs (local + production):

```
CLIENT_URL=http://localhost:3000,https://your-app.netlify.app
```

Save → Render will redeploy automatically.

---

## Step 6: Verify Everything Works

1. Open your frontend URL
2. Login as admin: `admin@gmail.com` / `Admin@123`
3. Browse courses, enroll as student
4. Check admin dashboard analytics

---

## Environment Variables Summary

### Backend (`backend/.env` or Render dashboard)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (Render sets automatically) |
| `HOST` | `0.0.0.0` for cloud hosting |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRE` | Token expiry e.g. `7d` |
| `NODE_ENV` | `production` on server |
| `CLIENT_URL` | Frontend URL(s) for CORS |

### Frontend (Netlify/Vercel dashboard)

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend URL + `/api` |

---

## Important Notes

- **Never commit** `.env` files or share passwords publicly
- **Render free tier** sleeps after 15 min inactivity — first request may take ~30 seconds
- **File uploads** on Render free tier are stored temporarily — they reset on redeploy. Course thumbnails from seed use external URLs and work fine
- **Password special characters** in Atlas URI must be URL-encoded (`@` → `%40`, `#` → `%23`)

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoDB Connection Error` | Check Atlas IP whitelist, username/password, connection string |
| CORS error in browser | Set `CLIENT_URL` to exact frontend URL (no trailing slash) |
| `Network Error` on login | Check `REACT_APP_API_URL` points to live backend `/api` |
| Empty courses page | Run `npm run seed` in Render Shell |
| 401 after login | Clear browser localStorage, login again |

---

## Quick Reference — Demo Login

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gmail.com | Admin@123 |
| Student | john.smith@demo.com | Student@123 |
