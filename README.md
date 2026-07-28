# Healthcare - Hospital Queue Management System

A full-stack Hospital Queue Management System built using the PERN stack.

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT
- bcrypt

## Project Structure

```
Healthcare/
│
├── frontend/
├── backend/
├── docs/
├── screenshots/
└── README.md
```

## Backend Setup

```bash
cd backend

npm install

npx prisma generate

npx prisma migrate dev

npm run dev
```

## Environment Variables

Create a `.env` file inside `backend`.

```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_secret"
PORT=5000
```

## Features

- User Authentication
- Appointment Booking
- QR Check-in
- Live Queue Tracking
- Doctor Dashboard
- Admin Dashboard
- Notifications