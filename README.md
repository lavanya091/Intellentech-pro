# ProManage | Role-Based Project Management System

A full-stack project management application with distinct interfaces for Admin, Manager, and Developer roles. Built as part of a Full-Stack Developer Intern Assignment.

## 🚀 Features

- **RBAC (Role-Based Access Control):** Custom dashboards and permissions for Admin, Manager, and Developer roles.
- **Authentication:** Secure JWT-based login, role-based redirection, and "Forgot Password" flow via email.
- **Admin Tools:** User account management (CRUD, active/disable) and system-wide statistics.
- **Manager Tools:** Project creation, task assignment to developers, and progress monitoring.
- **Developer Tools:** Kanban board for tracking assigned tasks with status movement buttons and comments.
- **Audit Logging:** Comprehensive activity log with filtering by date, user, and action type.

## 🛠 Tech Stack

- **Frontend:** React 18, Tailwind CSS, Vite, Lucide React, Recharts, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Atlas supported).
- **Email:** Nodemailer (Mailtrap for development).

## 📁 Project Structure

```bash
project-management-system/
├── backend/
│   ├── controllers/    # API logic
│   ├── middleware/     # Auth & RBAC
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── scripts/        # Seed script
│   ├── utils/          # Logger & Email helpers
│   └── server.js       # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # UI components
    │   ├── context/    # Auth state
    │   ├── pages/      # Role-specific views
    │   └── App.jsx     # Routing
    └── tailwind.config.js
```

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js (v16+)
- MongoDB Atlas account/URI
- Mailtrap account (for testing emails)

### 2. Backend Configuration
1. Navigate to `backend/`
2. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   SMTP_HOST=sandbox.smtp.mailtrap.io
   SMTP_PORT=2525
   SMTP_USER=your_user
   SMTP_PASS=your_password
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Seed the database with sample users:
   ```bash
   npm run seed
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```

## 👥 Seed Users

| Name | Email | Role | Password |
|------|-------|------|----------|
| Rahul Sharma | rahul.sharma@taskapp.dev | Admin | Test@123 |
| Sneha Rao | sneha.rao@pm.dev | Manager | Test@123 |
| Priya Mehta | priya.mehta@taskapp.dev | Developer | Test@123 |
| Arjun Nair | arjun.nair@taskapp.dev | Developer | Test@123 |
| Rohan Das | rohan.das@taskapp.dev | Developer (Disabled) | Test@123 |

---

Developed by Antigravity (Advanced Agentic Coding)
