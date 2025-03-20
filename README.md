# NTUA ECE SAAS 2024 PROJECT
  
## TEAM (08)
  
# SolveMyProblem Web App

![License](https://img.shields.io/badge/license-MIT-blue.svg)

## Overview

This web application is designed with a microservices architecture, allowing users to upload optimization problems that require significant processing power and have them solved by a remote solver. Users can view the results, edit problems, and purchase credits to run their tasks. Admins have additional capabilities, including access to analytics and statistics about the problems solved. The app currently supports three different problem models (Vehicle Routing Problem ,  Linear Optimization , Travelling Salesperson Problem) and can be easily upscaled to include more with a simple database update. This project includes stress tests, using jmeter, documentation and dockerization.

### Admin Credentials :

- username : admin
- password : 1234

## Features

- **User Registration & Authentication**: Secure sign-up and login.
- **Problem Submission**: Users can upload problems with various parameters, including values and JSON files.
- **Problem Management**: Edit and run submitted problems.
- **Credit System**: Purchase credits to run optimization tasks.
- **Admin Dashboard**: Access to analytics and statistics, such as problems solved this week.
- **Microservices Architecture**: Each service (Frontend, Users, Problems, Solver) operates independently.

## Tech Stack

- **Backend**: Node.js ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
- **Framework**: Express ![Express](https://img.shields.io/badge/Express-404D59?style=flat&logo=express&logoColor=white)
- **Database**: MySQL ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white) with Sequelize ORM ![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=flat&logo=sequelize&logoColor=white)
- **Frontend**: JavaScript ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
- **API Communication**: Axios ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat&logo=axios&logoColor=white) for API calls between services
- **Containerization**: Docker ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white) for easy deployment and management

## API Documentation

- [API Documentation](https://github.com/ntua/saas2024-08/tree/main/API%20Documentation)

## VPP Documentation

- [VPP Documentation](https://github.com/ntua/saas2024-08/tree/main/VPP%20Documentation)

## Microservices

- [Microservices](https://github.com/ntua/saas2024-08/tree/main/solveMyProblem_microservices)

## Testing

Performed Stress Tests using apache jmeter to ensure stability when hundreds of users perform tasks simultaneously :
- [Stress Tests](https://github.com/ntua/saas2024-08/tree/main/Stress%20Tests)

## Examples

A basic overview of the types of problems the app can solve, the necessary format for submissions, as well as a few examples with the corresponding json files :
- [Examples](https://github.com/ntua/saas2024-08/tree/main/Example%20Json%20Files)


## Getting Started

### Prerequisites

- Node.js 
- MySQL 
- Docker

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ntua/saas2024-08.git
   cd solveMyProblem_microservices/deployment_scripts

2. Make Sure Docker is Installed and engine is running : You can download it from : [Docker's official website](https://www.docker.com/get-started/)

3. Run deployment script : start.sh and open browser on http://localhost:3001 , if it doesn't start automatically.
- Admin with username : admin , password : 1234 will be inserted in the database automatically.
- The database will also be populated with models and their parameters.

## Contributors :

- Papafilopoulos Alexios el20155@mail.ntua.gr
- Papelis Stelios el20150@mail.ntua.gr
