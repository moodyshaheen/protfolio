# 🎨 My Portfolio – Full Stack Application

A complete portfolio with an Admin Panel for managing projects, built using **React + Node.js + MongoDB**.

## 📁 Project Structure

```
portfolio/
├── frontend/          # Projects showcase (React)
├── admin/             # Admin dashboard (React)
├── backend/           # Backend API (Node.js + Express + MongoDB)
├── deploy-all.ps1     # Automated deployment script
└── DEPLOYMENT_GUIDE.md  # Full deployment guide
```

## ✨ Features

### Frontend

* ✅ Clean and modern project showcase
* ✅ Fully responsive design (all devices)
* ✅ Modal to view project details
* ✅ GitHub and video links
* ✅ Display of used technologies

### Admin Panel

* ✅ Add new projects
* ✅ Edit existing projects
* ✅ Delete projects
* ✅ Image upload
* ✅ Manage technologies and links
* ✅ Export data as JSON

### Backend

* ✅ Complete RESTful API
* ✅ Image upload and management
* ✅ MongoDB database
* ✅ CORS enabled (works with Surge)
* ✅ Centralized error handling

## 🚀 Live Project Links

* **Frontend**: [https://falcon-portfolio.surge.sh](https://falcon-portfolio.surge.sh)
* **Admin Panel**: [https://falcon-admin.surge.sh](https://falcon-admin.surge.sh)
* **Backend API**: (Will be added after deployment on Render)

## 💻 Local Development

### Requirements

* Node.js (v14 or higher)
* MongoDB (local or Atlas)
* npm or yarn

### Run Backend

```bash
cd backend
npm install
# Create a .env file and add MONGODB_URI
npm run dev
```

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

### Run Admin Panel

```bash
cd admin
npm install
npm run dev
```

## 📦 Cloud Deployment

Follow the full deployment guide in [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

### Quick Deploy (Frontend & Admin)

```powershell
.\deploy-all.ps1
```

This script will:

1. Build the Frontend
2. Deploy it to Surge
3. Build the Admin Panel
4. Deploy it to Surge

## 🔧 Configuration

### Frontend `.env`

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Admin `.env`

```env
VITE_API_URL=https://your-backend-url.onrender.com
```

### Backend `.env`

```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=production
```

## 🛠️ Tech Stack

### Frontend & Admin

* React 19
* Vite
* CSS3 (modern, clean design)

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Multer (image uploads)
* CORS

### Deployment

* **Frontend & Admin**: Surge.sh
* **Backend**: Render.com
* **Database**: MongoDB Atlas

## 📖 API Documentation

### Projects API

#### Get All Projects

```
GET /api/projects
Response: Array of projects
```

#### Get Single Project

```
GET /api/projects/:id
Response: Project object
```

#### Create Project

```
POST /api/projects
Content-Type: multipart/form-data
Body: {
  title: string (required)
  description: string (required)
  githubLink: string
  videoLink: string
  technologies: JSON string array
  image: file
}
Response: Created project
```

#### Update Project

```
PUT /api/projects/:id
Content-Type: multipart/form-data
Body: Same as create
Response: Updated project
```

#### Delete Project

```
DELETE /api/projects/:id
Response: { message: "Project deleted successfully" }
```

## 🤝 Contribution

This is a personal project, but you can use it as a reference or a template for your own projects.

## 📝 License

MIT License – Feel free to use it however you like!

## 👨‍💻 Developer

**Mohamed Shaheen (Falcon)**

---

⭐ If you like this project, don’t forget to give it a star on GitHub!
