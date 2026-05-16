# Global TNA Service Request Board

A full-stack web application where homeowners can post service requests and tradespeople can browse, view details, and update request status.

## 🎯 Project Overview

This is a mini service request board built with:
- **Frontend**: Next.js 14+ (App Router)
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas + Mongoose
- **Styling**: Tailwind CSS
- **Testing**: Jest + Supertest

## 📋 Features

### Core Features
- ✅ List all service requests with filters (category, status)
- ✅ Search jobs by title or description
- ✅ View job details
- ✅ Create new service requests
- ✅ Update job status (Open → In Progress → Closed)
- ✅ Delete service requests
- ✅ JWT-based authentication

### Bonus Features
- ✅ Sample data seed script
- ✅ Comprehensive API unit tests (32 tests)
- ✅ Input validation (frontend & backend)
- ✅ Global error handling

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14+, React, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Testing | Jest, Supertest |
| Deployment Ready | Vercel (frontend), Render/Railway (backend) |

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone Repository
```bash
git clone <your-repo-url>
cd globaltna-service-request-board
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
PORT=5000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-secret-key-here
```

**Environment Variables:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `PORT` - Backend server port (default: 5000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `JWT_SECRET` - Secret key for JWT tokens (use a strong random string)

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file in `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start Backend

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Start Frontend

In a new terminal:

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### Seed Sample Data

To populate the database with sample jobs:

```bash
cd backend
npm run seed
```

This creates 5-10 sample service requests for testing.

## 🧪 Running Tests

Backend unit tests cover authentication and job endpoints:

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Results:** 32 tests passing
- Auth endpoints (register, login)
- Jobs endpoints (GET, POST, PATCH, DELETE)
- Validation & error handling
- Authentication checks

Tests use a separate test database (`globaltna-test`) to avoid affecting production data.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user (returns JWT token)

### Jobs (Public)
- `GET /api/jobs` - List all jobs (supports filters)
  - Query params: `?category=Plumbing&status=Open&search=kitchen`
- `GET /api/jobs/:id` - Get single job

### Jobs (Protected - requires JWT token)
- `POST /api/jobs` - Create new job
- `PATCH /api/jobs/:id` - Update job status
- `DELETE /api/jobs/:id` - Delete job

## 🏠 Frontend Pages

| Route | Purpose |
|-------|---------|
| `/` | Home - List all jobs with filters |
| `/jobs/new` | Create new service request |
| `/jobs/[id]` | View job details, update status, delete |
| `/login` | User authentication |

## 📊 Database Schema

### JobRequest Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  category: String (enum: Plumbing, Electrical, Painting, Joinery, Other),
  location: String,
  contactName: String,
  contactEmail: String (email format validation),
  status: String (enum: Open, In Progress, Closed, default: Open),
  createdAt: Date (auto)
}
```

### User Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Authentication

The app uses JWT (JSON Web Tokens) for authentication:

1. User registers with name, email, password
2. Password is hashed using bcryptjs
3. Login returns a JWT token
4. Protected endpoints (POST, PATCH, DELETE) require `Authorization: Bearer <token>` header
5. Token expires in 7 days

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
# Verify MONGODB_URI in .env is correct

# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run dev
```

### Frontend can't connect to API
```bash
# Ensure backend is running on port 5000
# Check NEXT_PUBLIC_API_URL in frontend/.env.local

# Clear Next.js cache
rm -r .next
npm run dev
```

### Tests failing
```bash
# Ensure MongoDB is accessible
# Check test database has globaltna-test in your Atlas cluster

cd backend
npm test -- --verbose
```

## 📝 Project Structure

```
globaltna-service-request-board/
├── backend/
│   ├── __tests__/              # Unit tests
│   ├── middleware/             # Auth middleware, error handler
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API endpoints
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   ├── seed.js                 # Database seeding
│   ├── jest.config.js          # Jest configuration
│   └── package.json
│
├── frontend/
│   ├── app/                    # Next.js app router
│   │   ├── jobs/[id]/          # Job detail page
│   │   ├── jobs/new/           # New job form
│   │   ├── login/              # Login page
│   │   └── page.js             # Home page
│   ├── components/             # Reusable React components
│   ├── context/                # React Context (Auth)
│   ├── lib/                    # API client
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md                   # This file
```

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Connect your GitHub repo to Vercel
# Set NEXT_PUBLIC_API_URL environment variable
# Deploy: Vercel automatically deploys on push
```

### Backend (Render or Railway)
```bash
# Push to GitHub
# Connect to Render/Railway
# Set environment variables in dashboard
# Deploy automatically
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Jest Testing](https://jestjs.io/)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

This project is part of the GlobalTNA Full-Stack Developer Intern assessment.

## ✨ Notes

- All data is cleaned up after tests run - production data is safe
- The app uses a separate test database (`globaltna-test`) for testing
- Environment variables are required - see `.env` files for examples
- Seed script populates sample data for development/testing
