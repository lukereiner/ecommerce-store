# 🛒 E-Commerce REST API

A robust RESTful backend API built with **Node.js**, **Express**, **PostgreSQL**, and **Passport.js**. 

This repository serves as **Part 1 (Backend)** of a full-fledged e-commerce platform project for Codecademy. It provides complete backend functionality for user authentication, product catalog management, cart handling, order processing, and checkout workflows.

---

## 🚀 Purpose & Overview

The goal of this project is to provide a secure, scalable, and fully functional API to power a modern React e-commerce frontend. It handles essential store operations:

- **Authentication & Security:** User registration, login, and session/token management via Passport.js.
- **Product Management:** Catalog browsing, filtering, and product details.
- **Shopping Cart System:** Managing user carts and item quantities (`/user/:userId/items`).
- **Order Processing & Checkout:** Handling cart transitions to completed orders.

---

## 🛠️ Tech Stack & Tools

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express.js](https://expressjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **Authentication:** [Passport.js](https://www.passportjs.org/)
- **Package Manager:** `npm`

---

## 📂 Project Structure & Routes Overview

| Resource | Methods | Primary Endpoints | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register`, `/auth/login`, `/auth/logout` | User account creation & session control |
| **Products** | `GET` | `/products`, `/products/:id` | Browse catalog and view product details |
| **User Cart** | `GET`, `POST`, `PATCH`, `DELETE` | `/user/:userId/items` | Manage user cart items and quantities |
| **Checkout** | `POST` | `/checkout` | Process current cart into a finalized order |
| **Orders** | `GET` | `/orders`, `/orders/:id` | View user order history and order details |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **PostgreSQL** installed and running locally

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/lukereiner/ecommerce-api.git
cd ecommerce-api
npm install
```
### 2. Environment Variables Setup
Create a .env file in the root directory:

```bash
PORT=3000
DATABASE_URL=postgres://username:password@localhost:5432/ecommerce_db
SESSION_SECRET=your_super_secret_session_key
```

### 3. Database Setup
Ensure your local PostgreSQL service is running and create the database:

```bash
# SERVER
PORT=3000

# DB
PGHOST='localhost'
PGUSER='api'
PGDATABASE='api'
PGPASSWORD='yourpassword'
PGPORT=5432

SESSION_SECRET=yoursessionsecret
```

There are sql set up files in the db folder

### 4. Running the Server
Start the development server:

```bash
node --watch server.js
```