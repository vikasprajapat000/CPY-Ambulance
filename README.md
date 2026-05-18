# CPY-Ambulance 🚑

A full-stack ambulance booking and tracking application built with React, Vite, Node.js, and Express. The project demonstrates a complete end-to-end solution for emergency services with frontend UX, backend API, and environment-safe configuration.

## Key Features

- Emergency ambulance booking flow
- Responsive React user interface
- Backend API built with Express.js
- Clean separation between frontend and backend
- Secure configuration using `.env` files

## Technology Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Project structure: monorepo with `frontend/` and `backend/`

## Project Structure

```text
CPY-Ambulance-main/
├── backend/          # Express server and API logic
├── frontend/         # React + Vite application
└── .gitignore        # Ignore node_modules and env files
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` and add your environment settings.

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Notes

- `node_modules/` and `.env` files are excluded from version control.
- Use `.env.example` for configuration templates.

---
*Maintained by [Vikas Prajapat](https://github.com/vikasprajapat000).*