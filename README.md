# Student Course Management System (SCMS)

A full-stack MERN application for managing students, courses, and enrollments. Built with React, Node.js, Express, MongoDB, and JWT authentication.

## Features

- Student registration, login, and profile management
- Admin dashboard with course and student management
- Course browsing, search, filter, and enrollment
- Progress tracking and recently viewed courses
- Dark mode toggle, toast notifications, pagination
- Role-based access control (Student / Admin)
- Profile image upload with Multer
- Seed data with 22 courses, 15 students, and 1 admin

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, React Router, Axios, Context API, Bootstrap 5, CSS Modules |
| Backend | Node.js, Express.js, Mongoose, JWT, bcrypt, Multer |
| Database | MongoDB |

## Project Structure

```
student-course-management/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers (MVC)
│   ├── middleware/      # Auth, upload, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── uploads/         # Uploaded images
│   ├── utils/           # Helpers & seed script
│   └── server.js
├── frontend/
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── pages/       # Route pages
│       ├── context/     # Auth & Theme context
│       ├── hooks/       # Custom hooks
│       └── services/    # API service layer
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

## Installation & Setup

### 1. Clone and navigate

```bash
cd student-course-management
```

### 2. Backend setup

```bash
cd backend
npm install
```

Copy environment variables (already included as `.env`):

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_course_management
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

### 3. Seed the database

Make sure MongoDB is running, then:

```bash
npm run seed
```

### 4. Start backend

```bash
npm run dev
```

Backend runs at `http://localhost:5000`

### 5. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

## Demo Credentials

### Admin
| Email | Password |
|-------|----------|
| admin@gmail.com | Admin@123 |

### Students (password: `Student@123`)
| Email |
|-------|
| john.smith@demo.com |
| emma.wilson@demo.com |
| liam.johnson@demo.com |
| olivia.brown@demo.com |
| noah.davis@demo.com |

## API Endpoints

### Authentication
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/signup | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/admin-login | Public |
| GET | /api/auth/profile | Private |
| PUT | /api/auth/update-profile | Private |
| PUT | /api/auth/change-password | Private |

### Courses
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/courses | Public |
| GET | /api/courses/:id | Public |
| POST | /api/courses | Admin |
| PUT | /api/courses/:id | Admin |
| DELETE | /api/courses/:id | Admin |

### Enrollments
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/enrollments | Student |
| GET | /api/enrollments | Private |
| DELETE | /api/enrollments/:id | Private |
| PUT | /api/enrollments/progress/:id | Student |

### Students
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/students | Admin |
| GET | /api/students/:id | Admin |
| DELETE | /api/students/:id | Admin |

### Analytics
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /api/analytics | Admin |

## Deployment (MongoDB Atlas + Online Backend)

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for the full step-by-step guide.

### Quick overview

1. **MongoDB Atlas** — create cluster, get connection string
2. **Render** — deploy `backend/` folder as Web Service
3. **Netlify / Vercel** — deploy `frontend/` with `REACT_APP_API_URL`
4. **Seed** — run `npm run seed` in Render Shell
5. **CORS** — set `CLIENT_URL` on backend to your frontend URL

### Backend environment (production)

```env
MONGO_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/student_course_management?retryWrites=true&w=majority
JWT_SECRET=long_random_secret
NODE_ENV=production
CLIENT_URL=https://your-frontend.netlify.app
HOST=0.0.0.0
```

### Frontend environment (production)

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api
```

### Deploy with Render Blueprint

The project includes `render.yaml` — on Render, choose **New Blueprint** and connect your repo for one-click backend setup.

## Testing

```bash
# Backend health check
curl http://localhost:5000/api/health

# Frontend tests
cd frontend
npm test
```

## License

MIT
