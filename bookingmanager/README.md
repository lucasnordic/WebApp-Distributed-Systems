# BookingManager

### Purpose of BookingManager component

The purpose of this component is to manage all bookings that come through the UI, validating the data and failing fast using a circuit breaker.

### Communication with other components

* Subscribes to ClientUI booking request messages through MQTT
* Publishes to ClientUI booking response through MQTT

### Link to main documentation repository

[Documentation repository](https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/documentation)

## Project setup
 - Clone the repository
 ```
https://git.chalmers.se/courses/dit355/test-teams-formation/team-10/bookingmanager.git
 ```
 - We use an online broker, as shown in `mqtt/connect.js`, if you would like to change this to a local config then:
 - Install MQTT-broker
 - Download [Mosquitto](https://mosquitto.org/)
 - Update `mqtt/connect.js` with your local settings
 - Ensure you have installed [Node.js](https://nodejs.org/en/)
 - Navigate to the server folder in the repository
 - Open the folder in a terminal
 - Install all dependencies with 
```
npm i
```
 - Run the component
 ```
 npm run start/dev
 ```
 - BookingManager should now be running now

## Softwares

* [Opossum](https://www.npmjs.com/package/opossum)
* [MQTT](https://www.npmjs.com/package/mqtt)

## References
* [Opossum documentation](https://nodeshift.dev/opossum/)
* [Circuit breaker article](https://blog.appsignal.com/2020/07/22/nodejs-resiliency-concepts-the-circuit-breaker.html)
