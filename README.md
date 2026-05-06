# 🎓 Student Information Management System (SIMS)

A full-stack web application to manage student academic records, built using the **MEAN Stack** — MongoDB, Express.js, Angular 17+, and Node.js.

---

## 🚀 Features

- **Student Management** — Add, view, edit, and delete student profiles
- **Marks & Grades** — Enter internal and external marks with automatic grade and CGPA calculation
- **Dashboard Analytics** — Real-time stats showing total students, active count, average CGPA, and distribution by department and semester
- **Search & Filter** — Find students by name, ID, email, department, semester, or status
- **Responsive UI** — Clean, professional interface with sidebar navigation

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 17+ (Standalone Components) |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Styling | CSS (component-level) |

---

## 📁 Project Structure

```
SIMS/
├── backend/
│   ├── models/
│   │   └── Student.js        # Mongoose schema with auto grade calculation
│   ├── routes/
│   │   └── students.js       # REST API routes
│   ├── .env                  # Environment variables
│   └── server.js             # Express server entry point
│
└── frontend/
    └── src/
        └── app/
            ├── components/
            │   ├── dashboard/
            │   ├── student-list/
            │   ├── student-form/
            │   ├── student-detail/
            │   ├── marks/
            │   └── navbar/
            ├── services/
            │   └── student.service.ts
            ├── models/
            │   └── student.model.ts
            ├── app.routes.ts
            └── app.config.ts
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local)
- Angular CLI (`npm install -g @angular/cli`)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/sims.git
cd sims
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student_management
```

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
ng serve
```

### 4. Access the Application
Open your browser and go to:
```
http://localhost:4200
```

> Make sure MongoDB service is running before starting the backend.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students (supports search & filter) |
| GET | `/api/students/:id` | Get single student |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/:id` | Update student |
| DELETE | `/api/students/:id` | Delete student |
| GET | `/api/students/stats/dashboard` | Get dashboard statistics |

---

## 🎯 Grading Logic

Marks are automatically calculated on save:

| Total Marks | Grade | Grade Point |
|-------------|-------|-------------|
| 90 - 100 | O | 10 |
| 80 - 89 | A+ | 9 |
| 70 - 79 | A | 8 |
| 60 - 69 | B+ | 7 |
| 50 - 59 | B | 6 |
| 40 - 49 | C | 5 |
| Below 40 | F | 0 |

**CGPA** = Average of all grade points

---

## 👥 Contributors

- Your Name — Full Stack Development

---

## 📄 License

This project is for educational purposes.
