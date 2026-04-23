# MyStore – Full Stack Angular E-Commerce Application

## Project Overview

MyStore is a full-stack e-commerce web application built using Angular for the frontend and a Node.js REST API backend running inside Docker.

The application allows users to browse products, view product details, register, log in, add items to a shopping cart, and complete a checkout process. The backend provides persistent data storage with seeded sample data so the application works immediately after setup.

This project was developed as part of the Udacity Full Stack JavaScript Nanodegree program and demonstrates real-world full-stack application architecture.

---

## Repository Structure

```
MY_STORE/
 ├── backend/      # Node.js REST API running in Docker
 ├── frontend/     # Angular application
 └── README.md
```

---

## Features

### User Features

* User registration (Sign Up)
* User login authentication
* Protected routes using Angular Guards
* Logout functionality

### Product Features

* Product listing page
* Product details page
* Fetch products from REST API
* Responsive product cards
* ADD/EDIT products

### Cart Features

* Add product to cart
* Remove product from cart
* Real-time cart total calculation
* Cart persistence during session

### Checkout Features

* Template-driven checkout form
* Form validation
* Order submission
* Order success confirmation page

### Architecture Features

* Angular standalone components
* Angular routing
* Route guards for authentication
* HTTP interceptors for API requests
* Services for state management
* Observable-based data handling (RxJS)
* REST API backend
* Dockerized backend environment
* Seeded database for immediate testing
* CORS configuration
* Clean modular project structure

---

## Technologies Used

Frontend:

* Angular
* TypeScript
* RxJS
* Bootstrap
* HTML

Backend:

* Node.js
* Express
* Postgres 
* REST API
* Docker
* Docker Compose

---

## System Requirements

* Node.js
* npm
* Docker
* Angular CLI

---

## Installation and Setup

Clone the repository:

```bash
git clone https://github.com/tarekrishmawi/my_store
cd MY_STORE
```

---

## Step 1 — Start Backend (Docker)

Navigate to the backend directory:

```bash
cd backend
```

# Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Copy `env.example` to `.env` and fill in the required variables. 


Install dependencies:

```bash
npm install
```

Start the backend container:

```bash
npm run docker:up
```

The backend will:

* Start automatically
* Seed the database
* Create sample products
* Create test user accounts

Backend API will run at:

```
http://localhost:3000
```

---

## Step 2 — Start Frontend (Angular)

Open a new terminal.

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run the Angular development server:

```bash
ng serve
```

Open the application:

```
http://localhost:4200
```

---

# Default Seeded User

During setup, a default user is automatically created.

Example:

```json
{
  "username": "tarekrishmawi",
  "password": "tarek2026"
}
```

## Project Structure (Frontend)

```
frontend/
 ├── src/
 │    ├── app/
 │    │    ├── components/
 │    │    ├── services/
 │    │    ├── models/
 │    │    ├── guards/
 │    │    ├── interceptors/
 │    │    └── pages/
```

---

## User Flow

1. User opens the application
2. Products are loaded from the backend API
3. User registers or logs in
4. User browses products
5. User views product details
6. User adds items to cart
7. User reviews cart
8. User completes checkout
9. Order confirmation is displayed

---

## Running the Application (Quick Start)

```
git clone <repo-url>

cd MY_STORE/backend
npm install
npm run docker:up

cd ../frontend
npm install
ng serve
```

---

## Notes for Reviewer

* The backend runs in Docker
* The database is automatically seeded
* All features are fully functional
* Haven't used all API endpoints
* If the backend is not running, the app may not function correctly since it depends on the API.

---

## Author

Tarek Rishmawi

---

## License

MIT
