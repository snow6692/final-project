
# 🧠 Backend — Outfit Organiser API

This is the backend API for the Outfit Organiser App, built with **Node.js**, **Express**, and **PostgreSQL** using **Prisma** ORM. It includes authentication, image uploading, and is deployed on **Koyeb**.

---

## 🌐 Live API

🔗 [https://chilly-ilyse-snow6692-94880624.koyeb.app](https://chilly-ilyse-snow6692-94880624.koyeb.app)

---

## ⚙️ Tech Stack

- **Express.js** — Backend framework  
- **Prisma** — ORM for PostgreSQL  
- **JWT** — Authentication  
- **Cloudinary** — Image uploads  
- **Neon** — PostgreSQL hosting  
- **Koyeb** — Backend deployment  

---

## 🛠️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/snow6692/final-project
cd final-project
```

---

### 2️⃣ Install Node.js and npm

- 📥 Download Node.js: https://nodejs.org/en/download  
- npm comes bundled with Node.js

---

### 3️⃣ Install Project Dependencies

```bash
npm install
```

---

### 4️⃣ Setup Environment Variables

Create a `.env` file in the root directory 



### 5️⃣ Start the Development Server

```bash
npm run dev
```

> Server will run on `http://localhost:3000`

---

## 📁 Project Structure

```
📦 final-project
├── prisma/              # Prisma schema and migrations
├── routes/              # All API routes
├── controllers/         # Request handlers
├── middlewares/         # Auth, error handling, etc.
├── utils/               # Helper functions
├── server.js            # App entry point
├── .env                 # Environment variables (not committed)
└── package.json
```

---

## 🧪 Example API Routes


| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/api/auth/register` | Register new user   |
| POST   | `/api/auth/login`    | Login user          |
| GET    | `/api/outfits`       | Get all outfits     |
| POST   | `/api/outfits`       | Create new outfit   |
| DELETE | `/api/outfits/:id`   | Delete an outfit    |

> 🔐 JWT token may be required in `Authorization` header for protected routes.

---

## 🚀 Deployment Details

- Hosted on **Koyeb**  
- PostgreSQL via **Neon**  
- Image Uploads via **Cloudinary**

---


