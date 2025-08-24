# Sager Task 

A simple Server that use socket.io to send the geo-location of the drone . 

### Stack overflow question:


Happy Coding : 
```
npm install
npm start
```


# SagerSpace-task

# Task Requirement's

- - Introduction

The target of this task is to have a drone tracing system, it shows all the drones live in space and classify them based on their registration number as allowed to fly (green) or not (red ).

- Task Description:

- The front-end gets the drones from the backend and shows them on the map.

- The Drone List (side panel) shows all drones currently in the sky.

- The path of every drone should be shown on the map (from the time of opening the page).

- Drones with registration numbers that start with letter B can fly (Green) , others do not (Red). (Ex: SG-BA is Green).

- Dashboard may have nothing, or something fun you like to show (bonus points).

- When you hover on a drone, it shows a popup showing the flight time and altitude.

- The counter in bottom right shows the number of red drones only.

- Yaw value indicates the orientation of the drone, and it should be shown on the map as an arrow in the drone icon.

- When a user clicks on the drone from the list. The map moves to that drone.

- When a user clicks on the drone in the map, it highlights the drone in the list. Technical Requirements:

- Your task is to implement the front-end part Only using ReactJS.

- The front-end part should communicate with backend using WebSocket.

- Use Mapbox for implementing the map.

- Use any state management tool you prefer.

- The system must handle thousands of drones without performance drop.

- Use Desing Patterns to showcase your code style.

- The Backed is already provided with the task. (README.md included)

- Send me the task on Github (Live host is a big plus).

- Implement the responsive interface.

- You're free to use existing open source React components or Javascript packages/libraries from npm to complete this task.

- Code is easily understood and communicative (eg. comments, variable names,etc).


- -The Figma UI Design.

```  
https://www.figma.com/file/KKDrzOQboUrlPk0QbtgjmI/Sager-Task?type=design&node-
id=0%3A1&mode=design&t=8JInLSibod30Em
```
 


# Task Documentation 

- i will use "monorepo" style to work on this project to show the result in one repo
 
