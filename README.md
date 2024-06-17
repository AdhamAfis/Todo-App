# Todo App

This is a simple Todo application built with React.js for the frontend and Express.js with Prisma for the backend. Users can sign up, sign in, add, update, and delete todos.

## Features

- User authentication (sign up, sign in)
- Add, update, delete todos
- JWT token-based authentication
- Password hashing with bcrypt
- Input validation
- Protected routes
- Responsive design

## Technologies Used

### Frontend

- React.js
- React Router
- Axios
- Tailwind CSS

### Backend

- Node.js
- Express.js
- Prisma
- PostgreSQL
- JWT for authentication
- bcrypt for password hashing

## Getting Started

### Prerequisites

- Node.js installed on your machine
- PostgreSQL installed and running

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/AdhamAfis/Todo-App.git


2. Navigate to the project directory:

   ```bash
   cd Todo-app
   ```

3. Install dependencies for both frontend and backend:

   ```bash
   cd todo-app
   npm install

   cd ../todo-app-backend
   npm install
   ```

4. Set up environment variables:

   - Create a `.env` file in the `backend` directory.
   - Define the following variables:

     ```plaintext
     PORT=4000
     DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public"
     JWT_SECRET=your_jwt_secret
     ```

5. Run the development servers:

   ```bash
   # In the backend directory
   npx nodemon index.js

   # In the frontend directory
   npm run dev
   ```

6. The app should now be running on `http://localhost:5173` for the frontend and `http://localhost:4000` for the backend.

## License

This project is licensed under the [MIT License](LICENSE).
