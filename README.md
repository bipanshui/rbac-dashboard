# RBAC Dashboard

A **Role-Based Access Control (RBAC)** dashboard built with **Next.js 16**, **Prisma**, and **PostgreSQL**. It provides user authentication, role management, and team organization out of the box.

![High-level architecture](project/images/image.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | [Prisma 7](https://www.prisma.io/) |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` |
| Styling | Tailwind CSS v4 |

---

## Features

- 🔐 **Authentication** — Register, login, logout with JWT stored in HTTP-only cookies
- 👤 **Role-Based Access** — Three roles: `ADMIN`, `MANAGER`, `USER`
- 👥 **Team Management** — Users can belong to teams, identified by a unique team code
- 🛡️ **Protected Routes** — Server-side session resolution via `getCurrentUser()`
- 🏥 **Health Check** — `/api/health` endpoint to verify the API is running

---

## Project Structure

![Project structure overview](project/images/image2.png)

```
rbac-dashboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/       # POST /api/auth/login
│   │   │   ├── logout/      # POST /api/auth/logout
│   │   │   ├── me/          # GET  /api/auth/me
│   │   │   └── register/    # POST /api/auth/register
│   │   ├── user/            # User management endpoints
│   │   └── health/          # GET  /api/health
│   ├── lib/
│   │   ├── auth.ts          # JWT helpers, password hashing, getCurrentUser()
│   │   └── db.ts            # Prisma client singleton
│   └── types/               # Shared TypeScript types
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeding script
└── prisma.config.ts         # Prisma connection config
```

---

## Data Models

### User
| Field | Type | Notes |
|---|---|---|
| `id` | `String` | CUID, primary key |
| `email` | `String` | Unique |
| `password` | `String` | Bcrypt-hashed |
| `name` | `String` | |
| `role` | `Role` | Defaults to `USER` |
| `teamId` | `String?` | Optional FK to Team |

### Team
| Field | Type | Notes |
|---|---|---|
| `id` | `String` | CUID, primary key |
| `name` | `String` | Unique |
| `description` | `String?` | Optional |
| `code` | `String` | Unique join code |

### Role (enum)
```
ADMIN | MANAGER | USER
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd rbac-dashboard
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-super-secret-jwt-key"
```

### 3. Set Up the Database

```bash
# Push schema to the database
npm run db:push

# (Optional) Generate Prisma client manually
npm run db:generate

# (Optional) Seed the database
npm run db:seed
```

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## API Reference

![Backend architecture](project/images/image3.png)

### Auth

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new user account | ❌ |
| `POST` | `/api/auth/login` | Login and receive a JWT cookie | ❌ |
| `POST` | `/api/auth/logout` | Clear the auth cookie | ✅ |
| `GET` | `/api/auth/me` | Get the currently logged-in user | ✅ |

### Other

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | API health check |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:push` | Push schema changes to the database |
| `npm run db:seed` | Seed the database with initial data |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `JWT_SECRET` | ✅ | Secret key used to sign JWT tokens |
