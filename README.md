# Vibe Commerce

This project is a mock e-commerce shopping cart application built as a full-stack solution for Vibe Commerce screening. It features a React frontend and a Node.js/Express backend, demonstrating core e-commerce functionalities like managing a shopping cart and processing a mock checkout.

## Features

1. Product Display: View a list of available products.
2. Add to Cart: Add any product to the shopping cart.
3. View Cart: See all items in the cart, with quantities and a running total.
4. Remove from Cart: Remove individual items from the cart.
5. Mock Checkout: "Purchase" the items in the cart, which saves an order to the database and clears the cart.

## Tech Stack

### Frontend:
1. React + Vite
2. React Context API (for cart state management)

### Backend:
1. Node.js
2. Express
3. Mongoose

### Database:
1. MongoDB

## Local Setup & Installation

- To run this project locally, you will need to set up both the backend server and the frontend client.

1. Backend Setup

The backend server handles all API logic and database interactions.

Clone the repository:

```
git clone <your-repository-url>
cd <project-folder>/server # Navigate to the backend directory
```


Install dependencies:

```
npm install
```


Set up environment variables:
Create a .env file in the server directory and add your database connection string:

```
# Your MongoDB connection string
MONGO_URI=mongodb://localhost:27017/vibe_commerce
# Your Port
PORT=<your_port>
```


Run the server:

```
npm run dev
```


The server will be running on http://localhost:5000 (or your configured port).

2. Frontend Setup
Navigate to the client directory:
```
cd ../client # Navigate to the frontend directory
```


Install dependencies:
```
npm install
```

Run the client:
```
npm run dev
```


The React app will open in your browser at http://localhost:5173.

## Implemented API Endpoints

The backend provides the following RESTful API routes:

### Products

GET /api/v1/products

Fetches a list of all mock products.

### Cart

GET /api/v1/cart

Retrieves the current user's cart items and total.

POST /api/v1/cart

Adds an item to the cart.

Body: { "productId": "...", "qty": 1 }

DELETE /api/v1/cart/:itemId

Removes a specific item from the cart.

### Checkout

POST /api/v1/checkout

Processes a mock checkout.

Saves the cart contents as a permanent order.

Clears the cart.

Body: { "customer": { "name": "...", "email": "..." } }

Returns a mock receipt.
