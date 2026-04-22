# Storefront Backend API - REQUIREMENTS

## Overview

This API supports an online storefront where users can browse products
and manage orders.

------------------------------------------------------------------------

## API Endpoints

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /users | Retrieve all users | Required |
| GET | /users/:id | Retrieve a single user | Required |
| GET | /users/:id/recent-purchases | Retrieve the most recent purchases for a user | Required |
| POST | /users | Create a new user | Required |
| POST | /users/authenticate | Authenticate user and return JWT | Not Required |
| PUT | /users/:id | Partial update user | Required |
| DELETE | /users/:id | Delete a user | Required |

### Products

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | /products | Retrieve all products | Not Required |
| GET | /products/:id | Retrieve a single product | Not Required |
| POST | /products | Create a product | Required |
| GET | /products/popular/topfive | Top 5 popular products | Not Required |
| GET | /products/category/:category | Products by category | Not Required |
| PUT | /products/:id | Update a single product | Required |
| DELETE | /products/:id | Delete a single product | Required |

### Orders

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /orders | Create a new order | Not Required |
| PUT | /orders/:id | Update order status | Required |
| GET | /orders/current/:user_id | Current active order for user | Required |
| GET | /orders/completed/:user_id | Completed orders for user | Required |
| POST | /orders/:id/products | Add product to order | Required |

### User

-   id: number
-   username: string
-   firstName: string
-   lastName: string
-   password_hash: string (hashed before storage)

------------------------------------------------------------------------

### Product

-   id: number
-   name: string
-   price: number
-   category: string

------------------------------------------------------------------------

### Order

-   id: number
-   user_id: number
-   status: 'active' \| 'complete'

------------------------------------------------------------------------

### Order_Product

-   id: number
-   order_id: number
-   product_id: number
-   quantity: number

------------------------------------------------------------------------

## Database Schema

### users

-   id SERIAL PRIMARY KEY,
-   first_name VARCHAR(100) NOT NULL,
-   last_name VARCHAR(100) NOT NULL,
-   username VARCHAR(100) UNIQUE NOT NULL,
-   password_hash TEXT NOT NULL,
-   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP


------------------------------------------------------------------------

### products

 -  id SERIAL PRIMARY KEY,
 -  name VARCHAR(255) NOT NULL,
 -  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
 -  category VARCHAR(100),
 -  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

------------------------------------------------------------------------

### orders

- id SERIAL PRIMARY KEY,
- user_id INTEGER NOT NULL,
- status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'complete')),
- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
- CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE

------------------------------------------------------------------------

### order_products

 - id SERIAL PRIMARY KEY,
 - order_id INTEGER NOT NULL,
 - product_id INTEGER NOT NULL,
 - quantity INTEGER NOT NULL CHECK (quantity > 0),
 - CONSTRAINT fk_order_products_order
        FOREIGN KEY (order_id)
        REFERENCES orders(id)
        ON DELETE CASCADE,

 - CONSTRAINT fk_order_products_product
        FOREIGN KEY (product_id)
        REFERENCES products(id)
        ON DELETE CASCADE,

 -  CONSTRAINT unique_order_product
        UNIQUE (order_id, product_id)
------------------------------------------------------------------------

## Authentication

-   JWT (JSON Web Token) is used for securing endpoints
-   Include token in header:

Authorization: Bearer `<token>`{=html}

------------------------------------------------------------------------

## Notes

-   Passwords are hashed using bcrypt before storing
-   Only authenticated users can create users and products
-   Orders are linked to users via user_id
-   Products are linked to orders through a join table (order_products)

------------------------------------------------------------------------