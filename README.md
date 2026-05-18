# CPY-Ambulance 🚑

A comprehensive, full-stack web application designed to manage ambulance services efficiently. It bridges the gap between those in need of emergency transport and the ambulance providers, offering real-time tracking, reliable scheduling, and a user-friendly interface.

This project demonstrates strong full-stack capabilities, including building robust backend APIs and responsive frontend applications.

## 🚀 Features

- **User & Driver Authentication**: Secure login for both users and ambulance drivers.
- **Emergency Booking**: Quick and easy process to request an ambulance during emergencies.
- **Real-Time Availability**: View available ambulances nearby and their current status.
- **Responsive Design**: Mobile-first architecture ensuring the application works flawlessly on all device sizes.
- **RESTful API**: Structured backend providing clean and scalable endpoints.

## 🛠️ Technology Stack

**Frontend:**
- **React.js** with Vite for lightning-fast development and optimized builds
- **Tailwind CSS** for rapid and modern UI styling
- **JavaScript (ES6+)**

**Backend:**
- **Node.js & Express.js** for handling server requests and building the RESTful API
- Environment configuration securely managed via `.env`

## 📂 Project Structure

This is a monorepo setup containing both the frontend and backend applications in their respective directories.

```text
CPY-Ambulance-main/
├── backend/          # Node.js Express server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/         # Vite + React application
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
└── .gitignore        # Root gitignore keeping environment files and modules out of version control
```

## ⚙️ Installation and Setup

To get this project running on your local machine, follow these steps:

### Prerequisites
- Node.js (v16+)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/vikasprajapat000/CPY-Ambulance.git
cd CPY-Ambulance
```

### 2. Backend Setup
```bash
cd backend
npm install
```
*Create a `.env` file in the backend folder using `.env.example` as a template and configure your environment variables.*

```bash
npm start
# or npm run dev (if configured)
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will usually be accessible at `http://localhost:5173` and the backend will run on its configured port (usually `5000` or `8000`).

## 🛡️ Best Practices & Security

- **Environment Variables**: Sensitive data such as API keys and database URIs are stored in `.env` files and strictly excluded from version control via `.gitignore`.
- **Modularity**: Code is logically divided into models, controllers, and routes to maintain clean architecture.
- **Dependency Management**: `node_modules` are properly ignored across both frontend and backend to keep the repository lightweight.

---
*Created and maintained by [Vikas Prajapat](https://github.com/vikasprajapat000/).*