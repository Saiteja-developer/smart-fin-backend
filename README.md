# SmartFin Backend

SmartFin is a production-ready financial management backend built with Node.js, Express, and MongoDB.  
It provides secure JWT authentication, budgeting, transaction tracking, goal management, and analytics for predicting financial health.

All backend development, design, and implementation by **Sai Teja**.

---

## Features

### Authentication
- Secure user registration and login
- JWT token–based session handling
- Password hashing using bcrypt

### Transactions
- Add, update, delete, and fetch transactions
- Categorize by income or expense
- Filter and aggregate for analytics

### Budgeting
- Set monthly budgets
- Auto-track used and remaining balance
- "On Track" / "Exceeded" status updates

### Goals
- Create and update savings goals
- Auto-update progress based on savings
- Email alerts when a goal is completed

### Analytics
- Predictive engine to forecast expenses
- Financial Health Score calculation

### Notifications
- Email notifications via Nodemailer for goal completion

---

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Language | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (Bearer Token) |
| Mailing | Nodemailer |
| AI / Analytics | Custom financial prediction engine |

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Saiteja-developer/smart-fin-backend.git
cd smart-fin-backend
```
Install dependencies

```
npm install
```
Create a .env file in the root directory:

PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
EMAIL_USER=<your_email_id>
EMAIL_PASS=<your_email_password_or_app_password>

Start the server
```
npm start
```

or, for development:
```
npm run dev
```

Default: http://localhost:5000
Deployed: https://smart-fin-backend.onrender.com

API Overview

Base URL:

https://smart-fin-backend.onrender.com/api

Auth Routes
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login and receive JWT
Transaction Routes
Method	Endpoint	Description
GET	/transactions	Get all user transactions
POST	/transactions	Add new transaction
PUT	/transactions/:id	Update transaction
DELETE	/transactions/:id	Delete transaction
Budget Routes
Method	Endpoint	Description
GET	/budget?month=YYYY-MM	Get budget for a month
POST	/budget	Add or update monthly budget
DELETE	/budget/:id	Delete a budget record
Goal Routes
Method	Endpoint	Description
GET	/goals	Get all goals
POST	/goals	Add a new goal
PUT	/goals/:id	Update goal progress
DELETE	/goals/:id	Delete a goal
Analytics Routes
Method	Endpoint	Description
GET	/analytics/predict	Predict next-month expenses & health score
Authentication Usage

All protected endpoints require JWT authorization:

Authorization: Bearer <your_token_here>


smart-fin-backend/
│
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── utils/
│
├── .env
├── package.json
├── server.js
└── README.md


Contribution

All development, architecture, and implementation for the SmartFin backend was done by:

Sai Teja

Full Stack Developer | Node.js • Express • MongoDB
