# API Documentation for Problem Service

## /problems

This endpoint retrieves the list of problems submitted by the user, or if the user is an admin, all problems.

### Request
- **Method**: GET
- **URL**: `/problems`
- **Headers**:
  - `Authorization`: Bearer token.

### Response
- **200 OK**:
  - Upon successful retrieval, returns a list of problems.
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
- **204 No Content**: 
  - If no problems are found.
- **401 Unauthorized**: 
  - If the user is not logged in.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /models

This endpoint returns a list of models available. Models represent problem types (eg Linear Optimization).

### Request
- **Method**: GET
- **URL**: `/models`

### Response
- **200 OK**:
  - Returns a list of models.
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
- **204 No Content**: 
  - If no models are found.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /parameters/:modelId

This endpoint retrieves the parameters for a specific model.

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
- **204 No Content**: 
  - If no parameters are found for the given model.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /deleteProblem

This endpoint deletes a specific problem, provided that the user has permission.

### Request
- **Method**: DELETE
- **URL**: `/deleteProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem to be deleted.

### Response
- **200 OK**: 
  - Returns a success message after the problem is deleted.
  - **Example**:
    ```json
    { "message": "Problem deleted successfully." }
    ```
- **204 No Content**: 
  - If the problem is not found or the user does not have permission to delete it.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /newProblem

This endpoint allows users to submit a new problem along with its parameters.

### Request
- **Method**: POST
- **URL**: `/newProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemName`: (string) The name of the new problem.
  - `problemTypeId`: (integer) The type ID of the problem.
  - `parameters`: (array) The parameters for the problem, with each parameter containing `parameterId` and `value`.

### Response
- **201 Created**: 
  - Returns a success message when the problem and parameters are successfully added.
  - **Example**:
    ```json
    { "message": "Problem and parameters added successfully." }
    ```
- **401 Unauthorized**: 
  - If the user is not logged in.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /infoProblem

This endpoint retrieves detailed information about a specific problem.

### Request
- **Method**: POST
- **URL**: `/infoProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem to retrieve information about.

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
- **204 No Content**: 
  - If the problem is not found or the user does not have permission to view it.
- **400 Bad Request**: 
  - If the `problemId` is missing from the request.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /updateProblem

This endpoint updates a problem and its associated values.

### Request
- **Method**: POST
- **URL**: `/updateProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem to be updated.
  - `problemName`: (string) The updated name of the problem.
  - `values`: (array) The updated parameter values, each containing `entryId` and `value`.

### Response
- **200 OK**: 
  - Returns a success message after the problem and values are updated.
  - **Example**:
    ```json
    { "message": "Problem and values updated successfully." }
    ```
- **204 No Content**: 
  - If the problem is not found or the user does not have permission to update it.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /runProblem/:problemId

This endpoint prepares a problem for solving by fetching its details and parameters.

### Request
- **Method**: GET
- **URL**: `/runProblem/:problemId`
- **URL Parameter**:
  - `problemId`: (integer) The ID of the problem whose details are being requested.
- **Headers**:
  - `Authorization`: Bearer token.

### Response
- **200 OK**: 
  - Returns the script path, the JSON content, and the arguments array to be used for solving the problem.
  - **Example**:
    ```json
    {
      "scriptPath": "/path/to/script",
      "jsonContent": "{...}",
      "arguments": ["arg1", "arg2"]
    }
    ```
- **204 No Content**: 
  - If the problem is not found or the user does not have permission to run it.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /statusProblem

This endpoint updates the status of a problem.

### Request
- **Method**: POST
- **URL**: `/statusProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Request Body**:
  - `problemId`: (integer) The ID of the problem whose status is being updated.
  - `newStatus`: (string) The new status, which must be one of `['Ready', 'Running...', 'Executed']`.

### Response
- **200 OK**: 
  - Returns a success message after the problem's status is updated.
  - **Example**:
    ```json
    { "message": "Problem status updated successfully." }
    ```
- **204 No Content**: 
  - If the problem is not found or the user does not have permission to update its status.
- **400 Bad Request**: 
  - If the `newStatus` is invalid.
- **500 Internal Server Error**: 
  - If an internal server error occurs.

---

## /statsProblem

This endpoint returns statistical data about problems, accessible only by admins.

### Request
- **Method**: GET
- **URL**: `/statsProblem`
- **Headers**:
  - `Authorization`: Bearer token.
- **Query Parameters**:
  - `filter`: (string) The filter for the stats, which can be `today`, `this-week`, `this-month`, or `lifetime`.

### Response
- **200 OK**: 
  - Returns problem statistics.
  - **Example**:
    ```json
    {
      "totalProblemsUploaded": 100,
      "problemsPerModel": [
        { "modelId": 1, "modelName": "Linear Model", "count": 50 },
        { "modelId": 2, "modelName": "Quadratic Model", "count": 50 }
      ]
    }
    ```
- **401 Unauthorized**: 
  - If the user is not an admin.
- **500 Internal Server Error**: 
  - If an internal server error occurs.
