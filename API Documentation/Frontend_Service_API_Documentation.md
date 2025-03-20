# API Documentation for Frontend Service

## /signup

This endpoint handles signup requests by calling the Users Service. It takes a username and password, sends them to the Users Service, and stores the returned token in the session.

### Request
- **Method**: POST
- **URL**: `/signup`
- **Request Body**:
  - `username`: (string) The username for the new account.
  - `password`: (string) The password for the new account.

### Response
- **200 OK**: 
  - If signup is successful, the token is returned and the user is redirected to the home page.
  - **Example**: `{ token: "fghs%gsfs$fds" }`
- **400 Bad Request**: 
  - If the signup request is invalid (e.g., missing username or password).
  - **Example**: `{ error: "Invalid signup request. Please check your input." }`
- **409 Conflict**: 
  - If the username already exists.
  - **Example**: `{ error: "Username already exists." }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---

## /login

This endpoint handles login requests by calling the Users Service. It takes a username and password, sends them to the Users Service, and stores the returned token in the session.

### Request
- **Method**: POST
- **URL**: `/login`
- **Request Body**:
  - `username`: (string) The username for the account.
  - `password`: (string) The password for the account.

### Response
- **200 OK**: 
  - If login is successful, the token is returned and the user is redirected to the home page.
  - **Example**: `{ token: "fghs%gsfs$fds" }`
- **400 Bad Request**: 
  - If the login credentials are missing or incomplete.
  - **Example**: `{ error: "Please check your login credentials. Username and Password are required." }`
- **401 Unauthorized**: 
  - If the login credentials are incorrect.
  - **Example**: `{ error: "Incorrect username or password." }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---

## /logout

This endpoint terminates the session by destroying the JWT token and redirecting the user to the home page.

### Request
- **Method**: POST
- **URL**: `/logout`

### Response 
  - The user is redirected to the home page after logout.
  
---

## /updateCredits

This endpoint allows the logged-in user to update their credits by calling the Users Service. A JWT token is required for authorization.

### Request
- **Method**: POST
- **URL**: `/updateCredits`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `creditsToAdd`: (integer) The number of credits to add.

### Response
- **200 OK**: 
  - If the credits update is successful, a message is returned.
  - **Example**: `{ message: "Credits updated successfully" }`
- **400 Bad Request**: 
  - If the credits value is invalid.
  - **Example**: `{ error: "Invalid request. Please check the credits value." }`
- **401 Unauthorized**: 
  - If the JWT token is missing or invalid.
  - **Example**: `{ error: "Unauthorized. Please log in to update credits." }`
- **204 Not Found**: 
  - If the user is not found.
  - **Example**: `{ error: "User not found." }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---

## /fetchCredits

This endpoint allows the logged-in user to view their current credits by calling the Users Service. A JWT token is required for authorization.

### Request
- **Method**: GET
- **URL**: `/fetchCredits`
- **Headers**:
  - `Authorization`: Bearer token.

### Response
- **200 OK**: 
  - If the credits are fetched successfully,their value, the user role and a message is returned.
  - **Example**: `{ message: "Credits fetched successfully" , credits : 50, role : 1}`
- **401 Unauthorized**: 
  - If the JWT token is missing or invalid.
  - **Example**: `{ error: "Unauthorized. Please login to see the number of credits." }`
- **204 Not Found**: 
  - If the user is not found in the database.
  - **Example**: `{ error: "User not found in database." }`
- **500 Internal Server Error**: 
  - If an internal server error occurs.
  - **Example**: `{ error: "Internal server error" }`

---


## /problems

This endpoint retrieves the list of problems from the Problems Service.

### Request
- **Method**: GET
- **URL**: `/problems`
- **Headers**:
  - `Authorization`: Bearer token.

### Response
- **200 OK**:
  - Returns the list of problems.
  - **Example**:
    ```json
    [
      {
        "problemId": 1,
        "problemName": "Example Problem",
        "username": "user1",
        "status": "Ready",
        "createdAt": "2024-09-12T12:34:56Z"
      }
    ]
    ```
- **500 Internal Server Error**:
  - If the Problem Service fails to retrieve the problems.

---

## /models

This endpoint retrieves the list of models from the Problems Service.

### Request
- **Method**: GET
- **URL**: `/models`


### Response
- **200 OK**:
  - Returns the list of models.
  - **Example**:
    ```json
    [
      {
        "modelName": "Linear Model",
        "description": "A basic linear optimization model",
        "modelId": 1
      }
    ]
    ```
- **500 Internal Server Error**:
  - If the Problem Service fails to retrieve the models.

---

## /parameters/:modelId

This endpoint retrieves the parameters for a specific model from the Problems Service.

### Request
- **Method**: GET
- **URL**: `/parameters/:modelId`
- **URL Parameter**:
  - `modelId`: (integer) The ID of the model whose parameters are being requested.


### Response
- **200 OK**:
  - Returns the parameters for the specified model.
  - **Example**:
    ```json
    [
      {
        "parameterId": 1,
        "parameterName": "Weight",
        "parameterType": "float"
      }
    ]
    ```
- **500 Internal Server Error**:
  - If the Problem Service fails to retrieve the parameters.

---

## /deleteProblem

This endpoint makes a request to delete a specific problem in the Problems Service.

### Request
- **Method**: DELETE
- **URL**: `/deleteProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem to be deleted.

### Response
- **200 OK**:
  - Success message after the problem is deleted.
  - **Example**:
    ```json
    { "message": "Problem deleted successfully." }
    ```
- **500 Internal Server Error**:
  - If the Problem Service fails to delete the problem.

---

## /newProblem

This endpoint allows users to submit a new problem and sends info to the Problems Service for database insertion.

### Request
- **Method**: POST
- **URL**: `/newProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemName`: (string) The name of the new problem.
  - `problemTypeId`: (integer) The type ID of the problem.
  - `parameters`: (array) The parameters for the problem, each containing `parameterId` and `value`.

### Response
- **201 Created**:
  - Success message after the problem and parameters are submitted.
  - Redirects to the `/home` route.
- **500 Internal Server Error**:
  - If the Problem Service fails to submit the problem.

---

## /infoProblem

This endpoint retrieves detailed information about a specific problem from the Problems Service .

### Request
- **Method**: POST
- **URL**: `/infoProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem.

### Response
- **200 OK**:
  - Returns detailed information about the problem.
  - **Example**:
    ```json
    {
      "problemName": "Example Problem",
      "createdAt": "2024-09-12T12:34:56Z",
      "values": [
        {
          "entryId": 1,
          "parameterName": "Weight",
          "parameterType": "float",
          "value": 0.5
        }
      ]
    }
    ```
- **500 Internal Server Error**:
  - If the Problem Service fails to retrieve the problem details.

---

## /updateProblem

This endpoint makes a request to update a specific problem in the Problems Service. Provides the new data submitted by the user.

### Request
- **Method**: POST
- **URL**: `/updateProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem.
  - `problemName`: (string) The updated name of the problem.
  - `values`: (array) The updated parameter values, each containing `entryId` and `value`.

### Response
- **200 OK**:
  - Success message after the problem is updated.
  - **Example**:
    ```json
    { "message": "Problem updated successfully." }
    ```
- **500 Internal Server Error**:
  - If the Problem Service fails to update the problem.

---

## /runSolver/:problemId

This endpoint triggers the execution of a solver for a given problem by calling the solver service.

### Request
- **Method**: POST
- **URL**: `/runSolver/:problemId`
- **Headers**:
  - `Authorization`: Bearer token.
- **Parameters**:
  - `problemId`: (integer) The ID of the problem to solve.
  
### Response
- **200 OK**:
  - A success message from the solver service after the solver has run.
  - **Example**:
    ```json
    { "message": "Solver ran successfully" }
    ```
- **500 Internal Server Error**:
  - If there is a problem running the solver.

---

## /fetchSolution

This endpoint retrieves the solution for a given problem by calling the solver service.

### Request
- **Method**: POST
- **URL**: `/fetchSolution`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem for which the solution is being fetched.

### Response
- **200 OK**:
  - Returns the solution and execution time for the problem.
  - **Example**:
    ```json
    {
      "solution": "Solution output...",
      "timeExecuted": 12.345
    }
    ```
- **500 Internal Server Error**:
  - If there is an issue retrieving the solution.

---

## /fetchStats

This endpoint retrieves statistics for both problems and solutions by calling the problem and solver services. Available to admin only.

### Request
- **Method**: GET
- **URL**: `/fetchStats?filter={filter}`
- **Headers**:
  - `Authorization`: Bearer token.
- **Query Parameters**:
  - `filter`: (optional) Can be one of `today`, `this-week`, `this-month`, or `lifetime`. Default is `lifetime`.

### Response
- **200 OK**:
  - Returns a combined statistics object for problems and solutions.
  - **Example**:
    ```json
    {
      "totalProblemsUploaded": 100,
      "problemsPerModel": {
        "Model A": 40,
        "Model B": 30,
        "Model C": 30
      },
      "totalExecutions": 80,
      "totalTimeExecuted": 150.75
    }
    ```
- **500 Internal Server Error**:
  - If there is an issue retrieving statistics.




