# SolveMyProblem - Models

This web app solves various optimization problems using **Google OR-Tools**. The app currently supports three problem types:

1. **Vehicle Routing Problem (VRP)**
2. **Linear Optimization**
3. **Travelling Salesperson Problem (TSP)**

## Problem Types

### 1. Vehicle Routing Problem (VRP)

The **Vehicle Routing Problem (VRP)** involves determining the most efficient routes for a fleet of vehicles to service a set of locations. The goal is to minimize the total distance traveled while adhering to constraints like vehicle capacity and maximum allowed distance.

#### Problem Instances:

- **Light VRP**  
  - Locations(JSON): `Locations_20.json`
  - Number of Vehicles: 1 or 2
  - Depot Index: 0 or 1
  - Max Distance(Meters): 500000 

- **Medium VRP**  
  - Locations(JSON): `Locations_200.json`
  - Number of Vehicles: 1 or 2
  - Depot Index: 0 or 1
  - Max Distance(Meters): 500000 

- **Heavy VRP**  
  - Locations(JSON): `Locations_1000.json`
  - Number of Vehicles: 1 
  - Depot Index: 0 or 1
  - Max Distance(Meters): 500000 

---

### 2. Linear Optimization

In **Linear Optimization**, also known as Linear Programming (LP), the goal is to maximize or minimize a linear objective function, subject to a set of linear inequality or equality constraints.

#### Problem Instances:

- **Light Linear Optimization** 
   - **Constraints**: `constraints.json`
   - **Objective Function**: 40x+30y

---

### 3. Travelling Salesperson Problem (TSP)

The **Travelling Salesperson Problem (TSP)** focuses on finding the shortest possible route that visits each location exactly once and returns to the starting point. This is a special case of the VRP where there is only one vehicle and no constraints other than visiting all locations.

#### Problem Instances:
- **Light TSP**  
  - Distances(Matrix): `tsp.json`
  - Depot Index : 0 or 1

- **Light TSP Variation**  
  - Distances(Matrix): `tsp_2.json`
  - Depot Index : 0 or 1

---

Feel free to create and run your own examples based on these templates. Keep in mind that harder problems will need more time to be executed.
