#!/usr/bin/env python3
import argparse
import json
from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

def create_data_model(file_path, depot):
    """Stores the data for the problem using data from a JSON file."""
    with open(file_path, 'r') as file:
        distance_matrix = json.load(file)
    data = {
        'distance_matrix': distance_matrix,
        'num_vehicles': 1,
        'depot': depot
    }
    return data

def print_solution(manager, routing, solution):
    """Prints solution on console."""
    print(f"Objective: {solution.ObjectiveValue()} miles")
    index = routing.Start(0)
    plan_output = "Route for vehicle 0:\n"
    route_distance = 0
    while not routing.IsEnd(index):
        plan_output += f" {manager.IndexToNode(index)} ->"
        previous_index = index
        index = solution.Value(routing.NextVar(index))
        route_distance += routing.GetArcCostForVehicle(previous_index, index, 0)
    plan_output += f" {manager.IndexToNode(index)}\n"
    plan_output += f"Route distance: {route_distance} miles\n"
    print(plan_output)

def main(args):
    """Entry point of the program."""
    # Create the data model
    data = create_data_model(args.distance_matrix, args.depot)

    # Create the routing index manager.
    manager = pywrapcp.RoutingIndexManager(
        len(data["distance_matrix"]), data["num_vehicles"], data["depot"]
    )

    # Create Routing Model.
    routing = pywrapcp.RoutingModel(manager)

    # Define the distance callback that takes two node indices and returns the distance between them.
    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data["distance_matrix"][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Setting first solution heuristic.
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    # Solve the problem.
    solution = routing.SolveWithParameters(search_parameters)

    # Print solution on console.
    if solution:
        print_solution(manager, routing, solution)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Solve the TSP with a distance matrix from a JSON file and other parameters.')
    parser.add_argument('distance_matrix', type=str, help='Path to the JSON file containing the distance matrix')
    parser.add_argument('depot', type=int, help='Depot index')
    args = parser.parse_args()
    main(args)
