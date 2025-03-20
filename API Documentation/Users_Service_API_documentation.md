# API Documentation for Users Service

## /signup

This endpoint allows new users to sign up by providing their username and password. The credentials are stored securely, and a JWT token is returned upon successful signup.

### Request
- **Method**: POST
- **URL**: `/signup`
- **Request Body**:
  - `username`: (string) The username for the new account.
  - `password`: (string) The password for the new account.

### Response
- **201 Created**: 
  - Upon successful signup, returns a JWT token.
  - **Example**: `{ message: "User created successfully", token: "JWT_TOKEN" }`
- **400 Bad Request**: 
  - If the username or password is missing.
  - **Example**: `{ error: "Username and password are required" }`
- **409 Conflict**: 
  - If the username already exists.
  - **Example**: `{ error: "Username already exists" }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---

## /login

This endpoint allows existing users to log in by providing their username and password. If the credentials are correct, a JWT token is returned.

### Request
- **Method**: POST
- **URL**: `/login`
- **Request Body**:
  - `username`: (string) The username for the account.
  - `password`: (string) The password for the account.

### Response
- **200 OK**: 
  - Upon successful login, returns a JWT token.
  - **Example**: `{ token: "JWT_TOKEN" }`
- **400 Bad Request**: 
  - If the username or password is missing.
  - **Example**: `{ error: "Username and password are required" }`
- **401 Unauthorized**: 
  - If the username or password is incorrect.
  - **Example**: `{ error: "Invalid username or password" }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---

## /updateCredits

This endpoint allows authorized users to add credits to their account or spend credits to execute a problem. A JWT token is required for authorization.

### Request
- **Method**: POST
- **URL**: `/credits`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `creditsToAdd`: (integer) The number of credits to add.

### Response
- **200 OK**: 
  - Upon successful credit update, returns a success message with the updated credits.
  - **Example**: `{ message: "Credits updated successfully", credits: 100 }`
- **400 Bad Request**: 
  - If the credits value is invalid or missing.
  - **Example**: `{ error: "Invalid credits value" }`
- **401 Unauthorized**: 
  - If the JWT token is missing or invalid.
  - **Example**: `{ error: "Invalid token. Login Required." }`
- **204 No Content**: 
  - If the user is not found.
  - **Example**: `{ error: "User not found" }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---

## /fetchCredits

This endpoint allows authorized users to view their current credits. A JWT token is required for authorization.

### Request
- **Method**: GET
- **URL**: `/fetchCredits`
- **Headers**:
  - `Authorization`: Bearer token.

### Response
- **200 OK**: 
  - Upon successful retrieval of credits, returns the number of credits and the user’s role(0 for user and 1 for admin).
  - **Example**: `{ credits: 100, role: 1 }`
- **401 Unauthorized**: 
  - If the JWT token is missing or invalid.
  - **Example**: `{ error: "Invalid token. Login Required." }`
- **204 No Content**: 
  - If the user is not found.
  - **Example**: `{ error: "User not found" }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---
