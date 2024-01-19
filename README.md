# Project Management App

This is a web application built using Laravel and ReactJS, providing project management features. Users can register, login, view project statistics, and perform CRUD operations on projects. JWT authentication is used to secure the API routes.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) - JavaScript runtime for building the frontend.
- [Composer](https://getcomposer.org/) - Dependency manager for PHP.
- [Laravel](https://laravel.com/) - PHP web application framework.

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/mayurjani91/ProjectManagementApp.git
   cd ProjectManagementApp
   ```

2. **Backend Setup (Laravel):**

   - Create a `.env` file by copying the `.env.example` file and configure your database and JWT secret key.

   ```bash
   cp .env.example .env
   ```

   - Install PHP dependencies and generate application key:

   ```bash
   composer install
   php artisan key:generate
   ```

   - Run database migrations and seed data:

   ```bash
   php artisan migrate --seed
   ```

3. **Frontend Setup (ReactJS):**

   - Navigate to the `frontend_react` directory:

   ```bash
   cd frontend_react
   ```

   - Install Node.js dependencies:

   ```bash
   npm install
   ```

4. **Run the Application:**

   - Start the Laravel development server:

   ```bash
   php artisan serve
   ```

   - Start the ReactJS development server:

   ```bash
   npm start
   ```

   Access the application at `http://localhost:3000`.

## API Endpoints

### User Authentication

- **Login:**
  - `POST /login`: User login.

- **Register:**
  - `POST /register`: User registration.

### Authenticated Routes

Routes within this group are protected and require JWT authentication.

- **Project Statistics:**
  - `GET /project/statistics`: Retrieve project statistics.

- **Projects:**
  - `GET /projects`: Retrieve a list of all projects.
  - `GET /projects/{id}`: Retrieve details of a specific project.
  - `POST /projects`: Create a new project.
  - `PUT /projects/{id}`: Update an existing project.
  - `DELETE /projects/{id}`: Delete a project.

- **User Actions:**
  - `POST /logout`: User logout.
