#!/usr/bin/env python3
import argparse
import json
import re
from ortools.linear_solver import pywraplp

def read_constraints(file_path):
    with open(file_path, 'r') as file:
        return json.load(file)

def parse_expression(solver, expression, x, y):
    expr = 0  # Start with a zero expression
    # Adjust to handle negative signs and multiplication explicitly
    terms = re.finditer(r'([+-]?\s*\d*\.?\d*\s*\*?\s*[xy])', expression.replace(' ', ''))
    for term in terms:
        comp = term.group()
        if '*' in comp:
            coeff, var = comp.split('*')
            coeff = float(coeff)
        else:
            # Check for implicit coefficient of 1 or -1
            parts = re.split(r'([xy])', comp)
            coeff = parts[0].strip()
            if coeff == '+' or coeff == '':
                coeff = 1.0
            elif coeff == '-':
                coeff = -1.0
            else:
                coeff = float(coeff)
            var = parts[1]

        if var == 'x':
            expr += coeff * x
        elif var == 'y':
            expr += coeff * y

    return expr

def LinearProgrammingExample(constraints_file, obj_func):
    solver = pywraplp.Solver.CreateSolver("GLOP")
    if not solver:
        print("Solver not created.")
        return

    x = solver.NumVar(0, solver.infinity(), "x")
    y = solver.NumVar(0, solver.infinity(), "y")

    constraints = read_constraints(constraints_file)
    for constraint in constraints:
        expr = parse_expression(solver, constraint["expression"], x, y)
        if constraint["type"] == "le":
            solver.Add(expr <= constraint["value"])
        elif constraint["type"] == "ge":
            solver.Add(expr >= constraint["value"])

    solver.Maximize(parse_expression(solver, obj_func, x, y))
    status = solver.Solve()

    if status == pywraplp.Solver.OPTIMAL:
        print("Solution:")
        print(f"Objective value = {solver.Objective().Value():0.1f}")
        print(f"x = {x.solution_value():0.1f}")
        print(f"y = {y.solution_value():0.1f}")
    else:
        print("The problem does not have an optimal solution.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Linear programming with dynamic inputs and constraints from JSON.')
    parser.add_argument('constraints_file', type=str, help='Path to the JSON file containing constraints')
    parser.add_argument('obj_func', type=str, help='Objective function as a string, e.g., "3*x + 4*y"')
    args = parser.parse_args()

    LinearProgrammingExample(args.constraints_file, args.obj_func)
