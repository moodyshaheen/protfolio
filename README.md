# Portfolio — Full-Stack Project Showcase

A professional, full-stack portfolio application with a **public frontend** for displaying projects, an **admin panel** for managing content, and a **REST API** backed by MongoDB. Built with React, Node.js, Express, and MongoDB Atlas.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

This repository contains a complete portfolio system in three parts:

| Part | Purpose | Port (local) |
|------|---------|--------------|
| **Frontend** | Public site where visitors view your projects | 5173 |
| **Admin** | Dashboard to add, edit, and delete projects | 5174 |
| **Backend** | REST API and file storage, connected to MongoDB | 3001 |

The frontend and admin panels consume the same API. Projects added or updated in the admin panel appear on the public frontend in real time.

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Frontend     │     │  Admin Panel    │     │    Backend      │
│  (React + Vite)│     │ (React + Vite)  │     │ (Node + Express)│
│   Port: 5173    │     │   Port: 5174    │     │   Port: 3001    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         │    HTTP / proxy       │    HTTP / proxy      │
         └───────────────────────┴───────────────────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  MongoDB Atlas   │
                                │   (Database)    │
                                └─────────────────┘
```

- **Local development:** Frontend and admin use Vite proxy to talk to the backend on `localhost:3001`.
- **Production:** Set `VITE_API_URL` in frontend and admin to your deployed backend URL.

---

## Project Structure

```
protfolio-main/
├── admin/                 # Admin panel (React + Vite)
│   ├── src/
│   │   ├── App.jsx        # Main admin UI
│   │   ├── App.css        # Admin styles
│   │   ├── config.js      # API base URL
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js     # Proxy to backend
│
├── backend/                # REST API (Node.js + Express)
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── models/
│   │   └── Project.js     # Mongoose schema
│   ├── routes/
│   │   └── routePro.js    # CRUD + file upload
│   ├── uploads/           # Uploaded images (created at runtime)
│   ├── server.js          # App entry, CORS, static files
│   ├── package.json
│   └── .env               # MONGO_URI, PORT, etc. (not committed)
│
├── frontend/               # Public portfolio (React + Vite)
│   ├── src/
│   │   ├── App.jsx        # Project grid + modal
│   │   ├── App.css
│   │   ├── config.js      # API base URL
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js     # Proxy to backend
│
├── deploy-all.ps1         # Build & deploy frontend + admin (e.g. Surge)
├── setup-env.ps1          # Set VITE_API_URL for frontend/admin
├── LOCAL_DEV.md           # Step-by-step local run
└── README.md              # This file
```

---

## Features

### Frontend (Public)

- Responsive project grid with images, title, description, and technologies
- Modal for full project details (description, links, tech tags)
- Links to GitHub and video (e.g. YouTube) when provided
- Fetches data from the backend API; no hardcoded project list

### Admin Panel

- List all projects with image, title, description, and tech badges
- **Add** new projects (title, description, GitHub link, video link, technologies, image upload)
- **Edit** existing projects (same fields + optional new image)
- **Delete** projects with confirmation
- **Export** current project list as JSON
- **Refresh** to reload from API
- Professional UI with design tokens, Inter font, and responsive layout

### Backend

- **REST API** for projects: `GET`, `POST`, `PUT`, `DELETE` on `/api/projects`
- **MongoDB** (Atlas or local) via Mongoose
- **Image upload** with Multer; files stored under `/uploads`, served at `/uploads`
- **CORS** configured for local frontend (5173) and admin (5174) and common production origins
- Health-style route: `GET /` and `GET /api/test` for quick checks

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 19, Vite, CSS3 (design tokens, responsive) |
| **Admin** | React 19, Vite, CSS3 (same design system) |
| **Backend** | Node.js, Express, Mongoose, Multer, dotenv, CORS |
| **Database** | MongoDB (Atlas or local) |
| **Dev** | ESLint, npm scripts |

---

## Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (or yarn)
- **MongoDB**: either
  - Local MongoDB (e.g. Community Server), or
  - A MongoDB Atlas cluster and connection string

---

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url>
cd protfolio-main
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables)):

```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
PORT=3001
```

Then:

```bash
npm run dev
```

You should see something like: `Server Started on http://localhost:3001` and `DB Connected`.

### 3. Admin panel

In a new terminal:

```bash
cd admin
npm install
npm run dev
```

Open **http://localhost:5174**. In dev, the app uses the Vite proxy to talk to the backend; no `VITE_API_URL` needed for localhost.

### 4. Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Projects you add or edit in the admin will appear here after refresh.

For more detail (including troubleshooting), see [LOCAL_DEV.md](./LOCAL_DEV.md).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` or `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` or `mongodb://localhost:27017/portfolio` |
| `PORT` | Server port | `3001` |
| `SECRET_KEY` | Optional; for future auth/signing | Any string |

Copy `backend/.env.example` to `backend/.env` and fill in your values. Do not commit `.env`.

### Frontend & Admin (production only)

For production builds, create `.env` in both `frontend/` and `admin/`:

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

Replace with your actual backend URL. Omit for local dev (Vite proxy is used).

---

## API Reference

Base URL (local): `http://localhost:3001`

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects` | List all projects (newest first) |
| `GET` | `/api/projects/:id` | Get one project by ID |
| `POST` | `/api/projects` | Create project (`multipart/form-data`: title, description, githubLink, videoLink, technologies, image) |
| `PUT` | `/api/projects/:id` | Update project (same body as POST) |
| `DELETE` | `/api/projects/:id` | Delete project |

### Static files

- **Images:** `GET /uploads/<filename>` — project images uploaded via the admin.

### Project model (MongoDB)

- `title` (string, required)
- `description` (string, required)
- `githubLink` (string)
- `videoLink` (string)
- `technologies` (array of strings)
- `image` (string, path like `/uploads/...`)
- `createdAt`, `updatedAt` (timestamps)

---

## Deployment

- **Backend:** Deploy to Render, Railway, or any Node host. Set `MONGO_URI` (or `MONGODB_URI`) and `PORT`. Ensure the `uploads` directory is writable or use external storage if needed.
- **Frontend & Admin:** Build with `npm run build` in each folder, then deploy the `dist/` output to Surge, Vercel, Netlify, etc. Set `VITE_API_URL` to your backend URL before building.

Example (PowerShell) for building and deploying frontend + admin:

```powershell
.\setup-env.ps1 -BackendUrl "https://your-backend.onrender.com"
cd frontend; npm run build
cd ..\admin; npm run build
# Then upload each dist/ to your hosting.
```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md), [START_HERE.md](./START_HERE.md), and [LOCAL_DEV.md](./LOCAL_DEV.md) for more options.

---

## License

MIT. You may use and modify this project for personal or commercial use.

---

## Author

**Mohamed Shaheen (Falcon)**

If you use this as a template or find it helpful, a star on GitHub is appreciated.
