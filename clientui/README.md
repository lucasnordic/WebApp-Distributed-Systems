Purpose of the Repository and structure of the code as well as related functionality, setup, user manuel etc. shall be included here. 

# Client UI

### Purpose of Client UI component
1. _The component helps users in booking an appointment_
2. _The component should display relevant information needed for them to make a successfull booking(Clinics, bookings, and time-slot/availability information)._
3. _Publish clinincs, availability and booking requests_
2. _Subscribe to getting clinics, availabilities and bookings information_

### Communication with other components
* The component publishes requests about getting availability and clinic information.
* The component publishes requests about making a booking.
* The component subscribes to the topics (and sub-variations): "clinicmanager/...", "availabilityChecker/...", and "bookingmanager/...". From those it can recieve messages about clinics information, availability information and booking responses(success/failure).

### Link to main documentation repository

[Documentation repository](https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/clientui.git)
___
## Requirements

* [Server](../server/README.md) components running:
  * [Clinic Manager](https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/clinicmanager) 
  * [Availability Checker](https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/availabilitychecker) 
  * [Booking Manager](https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/bookingmanager) 
* [Node.js](https://nodejs.org/en/download/) (v14) => installation instructions for [Linux](https://github.com/nodesource/distributions)
* [Npm](npm (https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)) - Node Package Manager
* [Visual Studio Code (VSCode)](https://code.visualstudio.com/) as IDE
  * [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) plugin for Vue tooling
  * [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) plugin for linting Vue, JS, and HTML code
* [Google Chrome](https://www.google.com/chrome/) as web browser

## Project setup
 - 1. Clone the repository
 ```
https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/availabilitychecker.git
 ````
 - 2. Navigate to the client folder in the repository
 - 3. Open the folder in a terminal
 - 4. then install all dependencies with:
 ```
 npm install
 ````
 - 5. Run the UI with
 ```
 npm run serve
 ````
* The ClientUI should be running now.
___

### Compiles and minifies for production

Builds the production-ready website into the `dist` directory.

```sh
npm run build
```
___
## Diagrams

_Add the necessary diagrams IF there is/are any_

## Softwares

_Add used software for the components_
* https://www.npmjs.com/package/vue-mqtt
* https://www.npmjs.com/package/vuex
* https://www.npmjs.com/package/mapbox-gl

## References
_Add references If it is applicable_