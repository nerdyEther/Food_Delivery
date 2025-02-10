# FoodDeliver - Full-Stack Food Delivery System with Role-Based Access Control

## Project Overview

FoodDeliver is a full-stack food ordering web application that allows users to browse menu items, add to cart, place orders, and manage their food delivery experience. The application provides different access levels for users, managers, and administrators (admin).

## Features

### User Features
- User authentication (signup/login)
- Browse menu items with filters and search
- Add items to cart
- Place orders
- View order history
- Responsive design for mobile and desktop
- The web app displays randomly selected food images on menu cards sourced from a CDN.

### Admin/Manager Features
- Add new menu items
- Update existing menu items
- Delete menu items
- View and manage orders

 ### Menu Management
- Pagination support
- Category filtering
- Search functionality
- Sorting options (by name, price)

### Cart System
- Persistent cart using localStorage
- Add/remove items
- Quantity management

### Order Workflow
- Create orders
- View order history
- **Managers and Admins can access and edit all orders**
- **Regular users can only view their own orders**
- Order status tracking
  


## Technologies Used

### Frontend
- React
- Tailwind CSS
- Shadcn UI Components
- React Router
- Axios
- JWT Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Bcrypt for password hashing


## Setup Instructions

### Backend Setup

1. Clone the repository
```bash
git clone https://github.com/nerdyEther/Food_Delivery.git
cd Food_Delivery/server
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=mongodb_connection_string
JWT_SECRET=jwt_secret_key
PORT=5555
```

4. Start the backend server
```bash
nodemon server.js
```

### Frontend Setup

1. Navigate to frontend directory
```bash
cd ../client
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run start
```

## Default User Roles

- **User**: Can browse menu, add to cart, place orders
- **Manager**: Can add/update menu items, view orders
- **Admin**: Full access including deleting menu items

## Default Credentials

For testing purposes:
- Admin: 
  - Username: admin
  - Password: 12345A
- User: 
  - Username: user
  - Password: 12345A
- Manager: 
  - Username: manager
  - Password: 12345A



## Challenges & Limitations

### Technical Challenges
- Managing state across components
- Creating responsive design
- Handling complex filtering and pagination 

### Current Limitations
- Updates or deletions of menu items are not reflected in the cart and order.
- The backend API lacks robust authentication, rate limiting, and throttling mechanisms.


