//MQTT 
const mqttClient = require("./utilities/connect");
const Publisher = require("./utilities/publisher");
const Subscriber = require("./utilities/subscriber");
const topics = require('./utilities/topics');

require('dotenv').config();

const AppointmentController = require('./Controller/appointmentController');
var controller = new AppointmentController();

const PublishHandler = require('./utilities/publishHandler')

var pubHistory = [];

const publish = new Publisher();
const subscribe = new Subscriber();
const subscribeTopics = topics.SUBSCRIBE_TOPICS;

mqttClient.on("connect", function () {
  mqttClient.on("message", async function (topic, message) {

    if (topic ===  subscribeTopics.CLIENT_SUBSCRIBE_TOPIC) {

      var sameUser = false;

      var userId = controller.idRevealer(message);
      console.log(userId);
      var availability = await controller.trigger(message);
      console.log (availability);
      var publication = new PublishHandler(userId, message, availability);
      
      //Check whether the current message is from a user who has subscribed before.
      //If they has, replace the last history with the new one.
      for (let i = 0; i < pubHistory.length; i++) {
        if (userId === pubHistory[i].userId) {
          sameUser = true;
          pubHistory[i] = publication;
        }
      }
      if (sameUser === false) {
        pubHistory.push(publication);
      }
      publish.publishData(availability, userId);
      console.log(availability);
      console.log('publishe to: ' + userId)


      /*setInterval (() => {
    for (let i = 0; i < pubHistory.length; i++) {
    }
    }, 3000);
    */
    } 
  });
  subscribe.subscribeToTopic(subscribeTopics.CLIENT_SUBSCRIBE_TOPIC);

  /*publish.publishMockData1();
  publish.publishMockData2();
  publish.publishMockData3();*/

  setInterval (async () => {
    for (let i = 0; i < pubHistory.length; i++) { 
      var oldResult = pubHistory[i].availability;
      var newResult = await controller.trigger(pubHistory[i].message);
      if (oldResult !== newResult) {
        pubHistory[i].availability = newResult;
        publish.publishData(newResult, pubHistory[i].userId);
        console.log(newResult);
        console.log('publishe to: ' + pubHistory[i].userId);
      }
    }
    }, 3000);
});

mqttClient.on("error", (error) => {
  console.log("Connection failed", error);
});

//Database
const db = require("./utilities/db");
db.connect;