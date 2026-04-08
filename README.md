# 🎯 DeepFocus — LMS for Engineers

A unified learning platform for CS engineers to study DSA, Full-Stack, System Design and more — without ever switching a tab.

![Tech Stack](https://img.shields.io/badge/React-Vite-blue) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![Gemini](https://img.shields.io/badge/Gemini-AI-orange)

## ✨ Features

- 🔐 Auth — Register / Login / Logout with JWT
- 🎓 Course Enrollment — Save progress to MongoDB
- 📚 Book Reader — Auto-save progress with chapter tracking
- 📊 Dashboard — Stats, Courses, Books in 3 tabs
- 🤖 AI Tutor — Ask DSA, SQL, React questions powered by Gemini AI
- 🗺️ Roadmap — Learning path for engineers

## 🛠️ Tech Stack

| Frontend | Backend | Database | AI |
|----------|---------|----------|----|
| React + Vite | Node.js + Express | MongoDB Atlas | Gemini AI |
| React Router | JWT Auth | Mongoose | @google/generative-ai |

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Gemini API key

### Installation

```bash
# Clone the repo
git clone https://github.com/aftabshekh/deep-focus.git
cd deep-focus

# Install all dependencies
npm run install-all

# Start development server
npm run dev
```

### Environment Variables

Create `server/.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```
## 📁 Project Structure
deep-focus/
├── client/          → React frontend (port 5173)
│   └── src/
│       ├── components/
│       ├── context/
│       └── data/
└── server/          → Node backend (port 5000)
├── config/
├── controllers/
├── middleware/
├── models/
└── routes/

## 🌐 Deployment

- **Frontend** → Vercel
- **Backend** → Railway
- **Database** → MongoDB Atlas

## 👨‍💻 Author

**Aftab Shekh** — [@aftabshekh](https://github.com/aftabshekh)

---

⭐ Star this repo if you found it helpful!
