Purpose of the Repository and structure of the code as well as related functionality, setup, user manuel etc. shall be included here. 

# Availibilitychecker

### Purpose of Availibitychecker component
This repository is in charge of calculating & publishing the available appointmnet time-slots.

### Communication with other components
Avilability checker is connected to both dentist clinic and appointmnet databases. It calculates the availability using the data from these databases and then sends it to the [clienUI repository](https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/clientui) through MQTT whenever it is requested.

### Link to main documentation repository

[Documentation repository](https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/documentation)

## Project setup
 - Clone the repository
 ```
https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/availabilitychecker.git
 ```
 - Install MQTT-broker
 - Download the [Mosquitto](https://mosquitto.org/)
 - Navigate to the server folder in the repository
 - Open the folder in a terminal
 - Install npm
 ```
 npm install
 ```
 - then install all dependenices with 
 ```
 npm i
 ```
 - Run npm
 ```
 npm run start/dev
 ```
 - Availibiltiychecker should now be running.

## Diagrams

_Add the necessary diagrams IF there is/are any_

## Softwares

_Add used software for the components_

## References
_Add references If it is applicable_