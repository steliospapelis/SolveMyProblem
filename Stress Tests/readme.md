# Load Testing with JMeter

This directory includes scripts and configurations for load testing our services using Apache JMeter. The tests are designed to simulate different traffic conditions and assess the performance and stability of our services under heavy load.

## Test Scenarios

1. **Sign Up and Login Requests Scenarios**
   - 1000 Sign Up and Logins
   - 2500 Sign Up and Logins
   - 4750 Sign Up and Logins
     
    Examining the results, we observe that the increase in load led to a rise in average response time, as expected. It is important to note that the integrity of the requests remained high, with a 0% error rate across all scenarios. All the requests are being handled simultaneously.

2. **Problem Submission Scenarios**
   - 200 Vehicle Routing Problem Submissions with 20 locations each, used also for later testing running the solver
   - 1000 Vehicle Routing Problem Submissions with 20 locations each, used also for later testing running the solver
   - 1000 Vehicle Routing Problem Submissions with varying amount of locations to simulate a randomised heavy traffic, used also for later testing running the solver

    These tests were of similar load, and the system handled them without any issues. The average response times were comparable, with the test involving the fewest submissions being the fastest.   
   
3. **Problem Solving Scenarios**
   - 200 Vehicle Routing Problem with 20 locations each
   - 1000 Vehicle Routing Problem Submissions with 20 locations each
   - 200 Vehicle Routing Problem Submissions with varying amount of locations to simulate a randomised heavy traffic
   - 1000 Vehicle Routing Problem Submissions with varying amount of locations to simulate a randomised heavy traffic

    These tests showed significant deviations in average response time. The problems with 20 locations were solved quickly, and the increase in requests resulted in a proportional rise in average response time. For the mixed-location problems, two paths were tested. First, 200 problems where 60% were simple and 40% were more complex, simulating a scenario where many users solve more demanding problems simultaneously. Second, 1,000 problems with a ratio of 90% simple and 10% complex to simulate realistic high-traffic conditions. The results were consistent, with a 0% error rate, indicating that the system can handle this level of traffic.

## Focus and Conclusion of Testing

The main objective of our testing was to evaluate the solver service's performance and stability under heavy traffic. The results were encouraging, as the service demonstrated both speed and reliability, maintaining consistent performance throughout.

## Contents
Each directory contains a:
  - ".jmx" file used to run the test
  - ".jtl" file with the result of each request
  - ".csv" file with the summary of the test plan
    
For more details and test scripts, refer to the files in this directory.

---


