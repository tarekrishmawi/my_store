# MyStore – Full Stack Angular E-Commerce Application

## Project Overview

MyStore is a full-stack e-commerce web application built using Angular for the frontend and a Node.js REST API backend running inside Docker.

This project demonstrates a real-world full-stack architecture, featuring a modular Angular frontend, template-driven forms, and a persistent PostgreSQL database.

## 🚀 Quick Start for Reviewers (Standalone Mode)

To meet the rubric requirement for a self-contained review flow, this application includes a Standalone Mock Mode. You do not need Docker or the backend running to test the full functionality.

### 1. Installation

From the root directory, run:

```bash
npm install
```

(This will automatically install all frontend dependencies).

### 2. Launch

From the root directory, run:

```bash
npm start
```

(Alternatively, navigate to `/frontend` and run `ng serve`).

### 3. Access the App

Open [http://localhost:4200](http://localhost:4200) in your browser.

**Note for Reviewers:**

- _Data Fallback:_ If the backend is not detected, the app automatically switches to a local `public/products.json` file.
- _Mock Auth:_ Authentication is managed via localStorage. You can log in using the pre-seeded credentials:
  - Username: `tarek`
  - Password: `tarek2026`
- _UI Feedback:_ Clear notifications toasts are provided for all major actions, including adding/removing items from the cart and checkout completion.

## 🛠 Repository Structure

```
MY_STORE/
 ├── backend/      # Node.js REST API (Dockerized)
 ├── frontend/     # Angular SPA (Standalone & Integrated)
 ├── package.json  # Root configuration for simplified setup
 └── README.md
```

## Features

### User & Cart Experience

- **Authentication:** User registration and login with protected routes using Angular Guards.
- **Product Catalog:** Dynamic product listing and detailed views.
- **Shopping Cart:** Add/Remove items with real-time total calculation and instant user feedback.
- **Checkout:** Validated checkout form with a success confirmation flow.

### Architecture

- **Modular Routing:** Implemented via a dedicated AppRoutingModule.
- **State Management:** Service-based logic for cart management and data persistence.
- **Full-Stack Ready:** Built-in HTTP Interceptors for API token management and Docker Compose orchestration for the database.

## Technologies Used

- **Frontend:** Angular (Standalone Components), TypeScript, RxJS, Bootstrap, HTML/CSS.
- **Backend:** Node.js, Express, PostgreSQL, Docker, Docker Compose.

## 🐳 Full-Stack Setup (Optional)

If you wish to test the project with the live REST API and database:

### Start Backend:

```bash
cd backend
cp .env.example .env
npm install
npm run docker:up
```

### Launch Frontend:

```bash
cd frontend
npm install
ng serve
```

The application will automatically detect the API at http://localhost:3000 and switch from Mock mode to Live mode.

## Project Structure (Frontend)

```
frontend/
 ├── src/
 │    ├── app/
 │    │    ├── app-routing.module.ts  # Explicit Routing Module
 │    │    ├── components/            # UI Components
 │    │    ├── services/              # Auth, Product, and Cart logic
 │    │    ├── models/                # TypeScript Interfaces
 │    │    ├── guards/                # Route Protection
 │    │    └── pages/                 # Full-page views
```

## Author

Tarek Rishmawi

## License

MIT
