# Node.js REST API for Product Management

This project implements a REST API for managing products and user authentication using Node.js, Express, MongoDB, and JWT (JSON Web Tokens). The API provides various endpoints to manage products, register and authenticate users, and secure routes based on user roles.

## Features

- **Product Management**: Create, read, update, and delete products.
- **User Authentication**: Register and login users using email and password.
- **Role-Based Authorization**: Protect routes based on user roles (e.g., admin).
- **MongoDB Integration**: Store data in MongoDB, with Mongoose models for products and users.
- **Input Validation**: Validation for product data and user credentials.
- **Token-Based Authentication**: Secure routes using JWT tokens.

## Technology Stack

- **Node.js**: JavaScript runtime for server-side development.
- **Express**: Web framework for building RESTful APIs.
- **MongoDB**: NoSQL database for storing products and users.
- **Mongoose**: MongoDB ODM for easy database interaction.
- **TypeScript**: Adds static typing to JavaScript, improving code quality and development experience.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Bcrypt.js**: For hashing passwords securely.
- **dotenv**: For managing environment variables.
- **Vitest**: A fast unit testing framework for TypeScript and JavaScript, used for running tests.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) installed (v20+ recommended).
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB setup).
- [Postman](https://www.postman.com/) or any API testing tool to test the endpoints.

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/product-api.git
    cd product-api
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Set up environment variables**:

   Create a `.env` file in the root directory and add the following variables:

    ```env
    DB_URI=mongodb://username:password@host:port/database
    DB_TEST_URI=mongodb://username:password@host:port/test_database
    JWT_SECRET=your_jwt_secret_key
    PORT=3000
    ```

    - `DB_URI` is the connection string for the main MongoDB database.
    - `DB_TEST_URI` is the connection string for the test MongoDB database.
    - `JWT_SECRET` is the secret key used to sign JWT tokens.
    - `PORT` is the port where the server will run.

4. **Start the server**:

    ```bash
    npm run dev
    ```

   The API will run on `http://localhost:3000` (or the port you defined in `.env`).



### **Running with Docker Compose**

1. **Ensure Docker Desktop is running**: Ensure Docker Desktop is open and running in the background. Docker must be installed and running on your system.

2. **Build the Docker containers**:
   In your terminal, run the following command to build the containers:

    ```bash
    docker-compose build
    ```

   This command will build the Docker image for your application.

3. **Start the Docker container**:
   After the build process completes, run the following command to start the container:

    ```bash
    docker-compose up
    ```

   This will start the application container (`product-api`).

4. **Access the application**:
   Once the container is running, the API will be accessible at `http://localhost:3000` (or the port specified in your `.env` file). You can use [Postman](https://www.postman.com/) or any other API testing tool to interact with and test the API endpoints.


5. **Stopping the container**:
   To stop the container, run:

    ```bash
    docker-compose down
    ```

   This will stop and remove the container.


## API Endpoints

### Product Routes

- **Create Product**  
  `POST /api/products`  
  Requires authentication (JWT token).  
  **Request Body**:
  ```json
  {
    "name": "Product Name",
    "quantity": 100,
    "price": 19.99
  }
  ```

  **Response**:
  - `201 Created`: Returns the created product.

- **Get All Products**  
  `GET /api/products`  
  Requires authentication (JWT token).  
  **Response**:
  - `200 OK`: Returns an array of all products.

- **Get Product by Name**  
  `GET /api/products/:name`  
  Requires authentication (JWT token).  
  **Response**:
  - `200 OK`: Returns the product with the specified name.
  - `404 Not Found`: If the product does not exist.

- **Update Product by Name**  
  `PUT /api/products/:name`  
  Requires authentication (JWT token) and admin role.  
  **Request Body**:
  ```json
  {
    "quantity": 150,
    "price": 25.99
  }
  ```

  **Response**:
  - `200 OK`: Returns the updated product.
  - `404 Not Found`: If the product does not exist.

- **Delete Product by Name**  
  `DELETE /api/products/:name`  
  Requires authentication (JWT token) and admin role.  
  **Response**:
  - `200 OK`: Returns the deleted product.
  - `404 Not Found`: If the product does not exist.

### Auth Routes

- **User Registration**  
  `POST /api/auth/register`  
  **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  **Response**:
  - `201 Created`: Returns a JWT token.

- **User Login**  
  `POST /api/auth/login`  
  **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

  **Response**:
  - `200 OK`: Returns a JWT token.

## Middleware

### Product Middleware

- **validateProductMiddleware**: Ensures that the product data (name, quantity, price) is valid before creating or updating a product.
- **checkProductNameMiddleware**: Checks if the product name exists in the database when updating or deleting a product.

### Auth Middleware

- **authenticate**: Verifies the JWT token sent in the `Authorization` header to authenticate users.
- **authorize**: Verifies if the user has the required role (e.g., admin) to access specific routes.
- **validateEmailPassword**: Validates the email and password format during user registration and login.

## Error Handling

Errors are handled uniformly across the API. If an error occurs during a database operation, a 500 status code is returned with a generic error message. If the request is invalid (e.g., missing required fields or invalid data), a 400 status code is returned with a specific error message.

### Common Error Responses

- **400 Bad Request**: Invalid or missing data.
- **401 Unauthorized**: No token or invalid token provided.
- **403 Forbidden**: User does not have permission to access the resource.
- **404 Not Found**: Resource (e.g., product) not found.
- **500 Internal Server Error**: Database or server-related issues.

## Example Requests

### Login User

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get All Products

```bash
GET /api/products
Authorization: Bearer <your_jwt_token>
Content-Type: application/json
```

### Create Product

```bash
POST /api/products
Authorization: Bearer <your_jwt_token>
Content-Type: application/json

{
  "name": "Laptop",
  "quantity": 10,
  "price": 999.99
}
```

## Testing the API

You can use Postman or any other API testing tool to test the API endpoints. Make sure to include the JWT token in the `Authorization` header for routes that require authentication.

## Contributing

If you find any bugs or want to contribute to the project, feel free to open an issue or create a pull request.

### Steps to Contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test them locally.
4. Submit a pull request with a description of your changes.

## License

This project is licensed under the MIT License.

---

### Contact

If you have any questions or need further assistance, feel free to reach out to the project maintainer via GitHub issues or email.

