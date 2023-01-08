const Methods = require('./methods')
const methods = new Methods();
const Publisher = require('../utilities/publisher')
const publisher = new Publisher();


class AppointmentController {

    currentMsg;
    currentClinic;
    currentDay;
    currentDate; 
    timeSlots;
    availableSlots = {
    "TimeSlots" : []
    };
    takenTimeSlots;


    constructor() {}


    idRevealer(message) {

        var stringMsg = message.toString();
        //console.log(stringMsg)
        this.currentMsg = JSON.parse(stringMsg);
        var userId = this.currentMsg.userId;
        return userId
    }

    /* Message from the clientUI is being translated into a json object to ease the next coming
     data manipulations. Muhaha */
    async trigger(message) {
        var stringMsg = message.toString();
        //console.log(stringMsg)
        this.currentMsg = JSON.parse(stringMsg);

        //Testing
        //console.log('\nMessage from ClientUI Repo: ' + stringMsg);
        //console.log('\nUserID:  ' + this.currentMsg.userId);
    
        //next steps:
        await this.processMsg();
        
        this.availabilityGenerator();
        await this.availabilityVerifier();
        //this.availabilityPublisher(); 

        return JSON.stringify(this.availableSlots);
    }


    /* Retrive the information from DBs based on the result */
    async processMsg() {
        this.currentClinic = await methods.clinicFinder(this.currentMsg.selectedClinic);
        var date = methods.dateParser(this.currentMsg.selectedDate);
        this.currentDate = date.dayDate;
        this.currentDay = date.weekDay;

        //Testing
        //console.log('\nCurren Clinic:');
        //console.log(JSON.stringify(this.currentClinic));
    }


    /* Generates the available timeslot for the current clinic based on the open hours recieved 
    from the Clinic database baout the current date and it saves them in an array. In this method all the timeslots are available
    and checking with the apppointment DB occurs in the furthur steps */
    availabilityGenerator() {
        this.availableSlots = {
            "TimeSlots" : []
        };
        var openHours = this.openHours();
        //console.log('\nAvailable hours:  ' + openHours);
        this.timeSlots = methods.timeSlotGenerator(openHours);
        //console.log('\nTime Solts:\n' + this.timeSlots);
        for (let i = 0; i < this.timeSlots.length; i++) {
            var timeslot = {
                "NumberofAvailableDentist" : this.currentClinic.dentists,
                "Time": this.timeSlots[i]
            };
            this.availableSlots.TimeSlots.push(timeslot);   
        }
    }

    /* Here, the generated available timeslots will get verified with the appointment DB to make 
    sure whether they are actually available */ 
    async availabilityVerifier() {
        this.takenTimeSlots = await methods.getTakenAppointment(this.currentClinic.id, this.currentDate);
        var frequency = methods.elementCounter(this.takenTimeSlots);
        var uniquetimes = methods.duplicateRemover(this.takenTimeSlots);

        //for testing
        //console.log('\n{taken timeslot: frequency} = ');
        //console.log(frequency);
        //console.log ('\nUnique Times= ')
        //console.log(uniquetimes);

        for (let i = 0; i < uniquetimes.length; i++) {
            var timeFrequency = frequency[uniquetimes[i]];

            for (let j = 0; j < this.availableSlots.TimeSlots.length; j++) {
                if (uniquetimes[i] === this.availableSlots.TimeSlots[j].Time && timeFrequency < this.availableSlots.TimeSlots[j].NumberofAvailableDentist ) {
                    this.availableSlots.TimeSlots[j].NumberofAvailableDentist = this.availableSlots.TimeSlots[j].NumberofAvailableDentist - timeFrequency;
                } else if (uniquetimes[i] === this.availableSlots.TimeSlots[j].Time && timeFrequency >= this.availableSlots.TimeSlots[j].NumberofAvailableDentist) {
                    this.availableSlots.TimeSlots.splice(j,1);
                }
            }
        } 
        //console.log(this.availableSlots);
    }


    /* The final availabilities are published */ 
    availabilityPublisher() {
        var userId = this.currentMsg.userId
        publisher.publishData(JSON.stringify(this.availableSlots), userId);
    }


    /* Get the open hours for each week day from the DB */
    openHours() {
        var openingHours = null;
        if (this.currentDay === "Monday") {
            openingHours = this.currentClinic.openinghours.monday;
        } else if (this.currentDay === "Tuesday") {
            openingHours = this.currentClinic.openinghours.tuesday;
        } else if (this.currentDay === "Wednesday") {
            openingHours = this.currentClinic.openinghours.wednesday;
        } else if (this.currentDay === "Thursday") {
            openingHours = this.currentClinic.openinghours.thursday;
        } else if (this.currentDay === "Friday") {
            openingHours = this.currentClinic.openinghours.friday;
        } 

        return openingHours;
    }
}

module.exports = AppointmentController