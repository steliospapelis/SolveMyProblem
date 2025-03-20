# Microservices for SolveMyProblem Web App

This directory contains the microservices that comprise the **SolveMyProblem** web application. Each microservice operates independently, facilitating a microservices architecture that allows for modular development and deployment.

## Microservices Overview

### 1. Frontend
- **Description**: This microservice serves as the API gateway for the application. It includes all EJS views for the user interface and handles incoming requests from users, routing them to the appropriate microservices.
- **Key Features**:
  - EJS templates for dynamic rendering of web pages.
  - API calls to other services for data retrieval and processing.
- [**API routes**](https://github.com/ntua/saas2024-08/blob/main/API%20Documentation/Frontend_Service_API_Documentation.md)

### 2. Users
- **Description**: This microservice manages the user database and handles user authentication and authorization. It includes functionalities for user registration, login, and credit management.
- **Key Features**:
  - User database containing usernames, passwords, and credit balances.
  - Secure login and sign-up processes using JWT tokens for authentication. Passwords are stored hashed in the database as an extra security measure.
- [**API routes**](https://github.com/ntua/saas2024-08/blob/main/API%20Documentation/Users_Service_API_documentation.md)


### 3. Problems
- **Description**: This microservice is responsible for managing problem submissions and related data. 
- **Key Features**:
  - Submission of optimization problems with associated parameters.
  - Management of problem updates and information retrieval.
  - Management of problem models. Currently includes three different models and can be easily upscaled with more.
-  [**API routes**](https://github.com/ntua/saas2024-08/blob/main/API%20Documentation/Problems_Service_API_documentation.md)

### 4. Solver
- **Description**: This microservice utilizes Google OR-Tools to solve optimization problems. It executes a Python script based on the model specified by the user and returns the results.
- **Key Features**:
  - Integration with Google OR-Tools for solving various optimization tasks.
  - Execution of Python scripts with user-provided parameters as arguments.
- [**API routes**](https://github.com/ntua/saas2024-08/blob/main/API%20Documentation/Solver_Service_API_Documentation.md)
  
