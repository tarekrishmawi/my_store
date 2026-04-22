# Storefront Backend API

This is a backend API for an online storefront built with **Node.js**, **Express**, and **PostgreSQL**.
It allows users to browse products, manage orders, and authenticate securely using **JWT tokens**.

The application is fully **Dockerized**, automatically sets up the development environment, and includes a complete automated test suite.

---

# Features

* API route authentication with JWT
* Product management
* Order management with status tracking
* Product categorization and popularity tracking
* Secure password hashing with bcrypt
* Database migrations using db-migrate
* Automated database setup and seeding
* Dockerized development environment
* Comprehensive testing with Jasmine

---

# Tech Stack

* Node.js
* Express
* TypeScript
* PostgreSQL
* Docker
* JWT Authentication
* db-migrate
* Jasmine & Supertest

---

# Prerequisites

Make sure the following are installed:

* Docker
* Node.js (recommended LTS >= 16)
* npm

No local PostgreSQL installation is required.

---

# Installation

Clone the repository:

```bash
git clone https://github.com/tarekrishmawi/store-front-backend-api.git
cd store-front-backend-api
```


# Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Copy `env.example` to `.env` and fill in the required variables. 

---

# Docker Development Setup

Start the development environment:

```bash
npm run docker:up
```

This command automatically performs:

* Builds the API container
* Installs dependencies
* Starts PostgreSQL
* Waits for database readiness
* Creates development and test databases
* Runs database migrations
* Seeds default user 
* Starts the development server

This behavior is configured in:

```yaml
command: sh -c "npm run setup && npm run dev"
```

---

# Stopping the Environment

```bash
npm run docker:down
```

---

# Automatic Development Setup

When running:

```bash
docker compose up
```

The system automatically executes:

```bash
npm run setup
npm run dev
```

Which performs:

1. Create development and test databases
2. Run database migrations
3. Seed the database
4. Start the development server

No manual setup step is required.

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

This user can be used immediately for authentication and testing.

---

# Running the Application

Development mode (auto-reload):

```bash
npm run dev
```

Production build:

```bash
npm run build
npm run start
```

---

# Running Tests

Run the full automated test suite:
**IMPORTANT** : make sure ENV=test to target test DB 

```bash
npm run docker:up

npm run test
```

These commands runs inside the Docker container and automatically:

1. Builds the project
2. Runs test database migrations
3. Executes Jasmine tests
4. Resets the test database

Internal execution:

```bash
docker exec storefront_backend_api sh -c \
"npm run build && \
 npm run migrate:test:up && \
 npm run jasmine && \
 npm run migrate:test:down"
```

---

# Available Scripts

Docker

```bash
npm run docker:up
npm run docker:down
```

Database

```bash
npm run create:db
npm run db:up
npm run db:down
npm run seed
npm run migrate:test:up
npm run migrate:test:down
```

Setup

```bash
npm run setup
npm run setup:test
```

Development

```bash
npm run dev
npm run build
npm run start
```

Testing

```bash
npm run setup:test
npm run test
```

---

# API Endpoints

Base Endpoint

```http
GET /
```

Returns a welcome message confirming server and database connection.

---

# Users

Get all users

```http
GET /users
Authorization: Bearer <token>
```

Get user by ID

```http
GET /users/:id
Authorization: Bearer <token>
```

Get user recent purchases 

```http
GET /users/:id/recent-purchases
Authorization: Bearer <token>
```

Create user

```http
POST /users
Authorization: Bearer <token>

{
  "userName": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

Authenticate user

```http
POST /users/authenticate

{
  "username": "johndoe",
  "password": "password123"
}
```

Update user (support partial update + password hashing)

```http
POST /users
Authorization: Bearer <token>

{
  "userName": "johndoe",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

Delete a user

```http
DELETE /users/:id
Authorization: Bearer <token>
```

---

# Products

Get all products

```http
GET /products
```

Get product by ID

```http
GET /products/:id
```

Create product

```http
POST /products
Authorization: Bearer <token>

{
  "name": "Product Name",
  "price": 29.99,
  "category": "Category Name"
}
```

Get top 5 popular products

```http
GET /products/popular/topfive
```

Get products by category

```http
GET /products/category/:category
```

Update a single product

```http
PUT /products/:id
Authorization: Bearer <token>
```

Delete a single product 

```http
DELETE /products/:id
Authorization: Bearer <token>
```
---

# Orders

Create order

```http
POST /orders

{
  "user_id": 1,
  "status": "active"
}
```

Update order status

```http
PUT /orders/:id
Authorization: Bearer <token>

{
  "status": "complete"
}
```

Get current order for user

```http
GET /orders/current/:user_id
Authorization: Bearer <token>
```

Get completed orders for user

```http
GET /orders/completed/:user_id
Authorization: Bearer <token>
```

Add product to order

```http
POST /orders/:id/products
Authorization: Bearer <token>

{
  "product_id": 1,
  "quantity": 2
}
```

---

# Database Schema

The application uses PostgreSQL with the following tables:

users
products
orders
order_products

See the migrations directory for full schema definitions.

---
# Testing with Postman

Import the JSON file in /postman

---

# Notes

* The project is fully Dockerized
* Development setup runs automatically
* Database is created automatically
* Default user is seeded automatically
* Test database is isolated
* Tests reset the database after execution
* No manual database configuration is required

---

# License

This project is licensed under the MIT License.