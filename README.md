# GlobalTNA Service Request Board

A full-stack web application where homeowners can post home service requests and tradespeople can browse, view details, and update request status.

## Live Demo

| | URL |
|---|---|
| Frontend | https://globaltna-service-request-board.vercel.app |
| Backend API | https://globaltna-service-request-board.onrender.com/api/jobs |

> The backend is hosted on Render's free tier and may take up to 60 seconds to respond after a period of inactivity.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| Testing | Jest, Supertest |
| Deployment | Vercel (frontend), Render (backend) |

## Features

- Browse all service requests with category, status and keyword filters
- Post a new service request (login required)
- View full job details and contact information
- Update job status — Open → In Progress → Closed
- Delete a service request (login required)
- JWT authentication — register and sign in
- Seed script with sample job data

## Project Structure

```
globaltna-service-request-board/
├── backend/
│   ├── __tests__/          # Jest unit tests
│   ├── middleware/          # Auth middleware, error handler
│   ├── models/              # Mongoose schemas (JobRequest, User)
│   ├── routes/              # API route handlers
│   ├── app.js               # Express app (no DB connection)
│   ├── server.js            # Entry point — connects DB and starts server
│   ├── seed.js              # Sample data seed script
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.js          # Home page — job listings
│   │   ├── jobs/new/        # New job form
│   │   ├── jobs/[id]/       # Job detail page
│   │   └── login/           # Login / register page
│   ├── components/          # Navbar, JobCard, StatusBadge
│   ├── context/             # JWT auth context
│   ├── lib/                 # API client (fetch wrapper)
│   └── package.json
│
└── README.md
```

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository

```bash
git clone https://github.com/dewminigamage/globaltna-service-request-board
cd globaltna-service-request-board
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/globaltna?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

Start the backend:

```bash
npm run dev
```

Runs on `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Runs on `http://localhost:3000`

### 4. Seed sample data (optional)

```bash
cd backend
npm run seed
```

Inserts 7 sample service requests into the database.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Jobs
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/jobs` | Public | List all jobs — supports `?category=`, `?status=`, `?search=` |
| GET | `/api/jobs/:id` | Public | Get a single job |
| POST | `/api/jobs` | Required | Create a new job |
| PATCH | `/api/jobs/:id` | Public | Update job status only |
| DELETE | `/api/jobs/:id` | Required | Delete a job |

## Database Schema

### JobRequest

```js
{
  title:        String  // required
  description:  String  // required
  category:     String  // Plumbing | Electrical | Painting | Joinery | Other
  location:     String
  contactName:  String
  contactEmail: String  // email format validated
  status:       String  // Open | In Progress | Closed  (default: Open)
  createdAt:    Date    // auto-set on create
}
```

### User

```js
{
  name:      String  // required
  email:     String  // required, unique
  password:  String  // bcrypt hashed
  createdAt: Date
  updatedAt: Date
}
```

## Authentication

1. Register with name, email and password
2. Password is hashed with bcryptjs before saving
3. Login returns a signed JWT (7-day expiry)
4. Protected endpoints require `Authorization: Bearer <token>` header

## Running Tests

```bash
cd backend
npm test
```

Tests cover the jobs API endpoints using Jest and Supertest with mocked Mongoose models.

## Deployment

### Backend — Render

- Branch: `Backend`
- Root Directory: leave blank
- Build Command: `cd backend && npm install`
- Start Command: `cd backend && node server.js`
- Environment variables: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`

### Frontend — Vercel

- Branch: `Frontend`
- Root Directory: `frontend`
- Environment variable: `NEXT_PUBLIC_API_URL` = `https://globaltna-service-request-board.onrender.com/api`
