# Solver Service API Documentation

## /runSolver

This endpoint triggers the execution of a solver for a given problem, makes a request to the problem service to fetch necessary info and then runs the problem and stores solution.

### Request
- **Method**: POST
- **URL**: `/runSolver`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem to solve.

### Response
- **201 Created**:
  - A success message after the solver has run and the solution has been stored in the database.
  - **Example**:
    ```json
    { "message": "Solution stored successfully." }
    ```
- **500 Internal Server Error**:
  - If the solver execution fails or there's a database error.

---

## /fetchSolution

This endpoint retrieves the solution for a given problem from the database if the user has authorization.

### Request
- **Method**: POST
- **URL**: `/fetchSolution`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem.

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
- **204 No Content**:
  - If no solution is found for the given problem ID.
- **400 Bad Request**:
  - If `problemId` is missing from the request body.
- **401 Unauthorized**:
  - If the token is invalid or missing.
- **500 Internal Server Error**:
  - If there is an issue retrieving the solution.

---

## /statsSolution

This endpoint retrieves statistical data on solver executions filtered by day,week,month or lifetime. Only accessible to admins.

### Request
- **Method**: GET
- **URL**: `/statsSolution?filter={filter}`
- **Headers**:
  - `Authorization`: Bearer token.
- **Query Parameters**:
  - `filter`: (optional) Can be one of `today`, `this-week`, `this-month`, or `lifetime`. Default is `lifetime`.

### Response
- **200 OK**:
  - Returns the total execution time and the number of executions.
  - **Example**:
    ```json
    {
      "totalExecutionsTime": 120.345 ,
      "numberOfExecutions": 5
    }
    ```
- **401 Unauthorized**:
  - If the user is not an admin.
- **500 Internal Server Error**:
  - If there is an issue retrieving the statistics.

---
