const moment = require('moment');
const Dbhandler = require('./dbhandler')

class Methods {

    mockAppointmnet;
    mockClinicDB;

    constructor() {}

    stringParser(string) {
        var parsedString = string.split('-');
        return parsedString;
    }


    /* Find the clinic from the DB by its ID */
     async clinicFinder(clinicId) {
        
        await Dbhandler.getClinicDocs().then((res) => {
            this.mockClinicDB = res;
            //console.log(this.mockClinicDB);
          }).catch((err) => {
            console.log(err);
          });

        //console.log(this.mockClinicDB);
        return this.clinicIterator(clinicId);  
    }

    clinicIterator(clinicId) {
        var foundClinic = null;
        for (let i = 0; i < this.mockClinicDB.dentists.length; i++) {
            let clinic = this.mockClinicDB.dentists[i];
            if (clinic.id == clinicId) {
                foundClinic = clinic;
                //console.log(foundClinic);
                return foundClinic;
            }
        } 
    }


    /* Gets a date as String and returns the coresponding week day of that date */
    dateParser(stringDate) {
        var date = {
            "weekDay" : "",
            "dayDate" : ""
        }
        //console.log(stringDate);
        var parsedDate= stringDate.split(', ');
        date.weekDay = parsedDate[0];
        date.dayDate = parsedDate[1]+ ', ' +parsedDate[2];

        return date;
    }


    /* Recieves an upper and lower timetreshhold as a String and divide them into 30 minutes timeSlots.
    Return the result as an array. */
    timeSlotGenerator(timeTreshold) {
        var timeSlots = [];
        var times = this.stringParser(timeTreshold);
        var open = moment(times[0], "HH:mm");
        var close = moment(times[1], "HH:mm");
        while (open < close) {
            
            //Push times other than fika and lunch breaks
            var isOpen = this.fikaChecker(open);
            
            if ( isOpen === true) {
                timeSlots.push(open.format("HH:mm")); 
            } 
            //Add interval of 30 minutes
            open.add(30, 'minutes');
        }
        return timeSlots;
    }


    /* Publishes the appointmnet list of a certain Clinic and Date in an array. */
    async getTakenAppointment(clinicId, date) {

        
        await Dbhandler.getAppointmentDocs().then((res) => {
            //console.log(res)
            this.mockAppointmnet = res;
            //console.log('appointment db goes here:')
            //console.log(this.mockAppointmnet);
          }).catch((err) => {
            console.log(err);
          });
        //console.log(JSON.stringify(this.mockAppointmnet));

        
        var takenTimeSlots = [];
        var takenAppointmnets = this.mockAppointmnet.msg;

        for (let i = 0; i < takenAppointmnets.length; i++) {
            //console.log(takenAppointmnets[i])

            var thisDate = takenAppointmnets[i].date[0];

            var isEqual = this.dateCompare(thisDate, date);

            if (takenAppointmnets[i].dentistID === clinicId && isEqual === true) {
                
                for (let j = 0; j < takenAppointmnets[i].time.length; j++) {
                    //console.log(takenAppointmnets[i].time[j].hours + ':' + takenAppointmnets[i].time[j].minutes)

                    var takenSlot = this.hourMaker(takenAppointmnets[i].time[j].hours, takenAppointmnets[i].time[j].minutes)
                    takenTimeSlots.push(takenSlot);
                }
                
            }
        }
        return takenTimeSlots;
    }

    dateCompare(dateA, dateB) {
        var isEqual = false;
        var stringA = new Date(dateA).toString();
        var yearA = stringA.substring(11,15);
        var dayA = stringA.substring(4,10);
        var fullDateA = dayA + ', ' + yearA;

        var tempo = dateB.slice(-8);
        //console.log(tempo);
        var fullDateB = dateB.substring(0,3) + dateB.slice(-9);

        if(tempo.substring(0,1) === ' ') {
            fullDateB = dateB.substring(0,3) + ' 0' + tempo.slice(-7);
        }
        //console.log(fullDateA + ' ' + fullDateB)
        if (fullDateA === fullDateB) {
            isEqual = true;
        }
        return isEqual;
    }

    
    /* Counts the number of elements in an array and returns an object with the elements as attributes and their quantity as 
    the value of that attribute */
    elementCounter(someList) {
        const counts = {};
        someList.forEach(function (x) {
            counts[x] = (counts[x] || 0) + 1;
        });
        return counts; 
    }

    /* Removes the duplicate elements in a list and return a list with unique elements */
    duplicateRemover(someList) {
        var uniqueList = [...new Set(someList)];
        return uniqueList;
    }

    fikaChecker(someDate) {
        var breakTimes = ['10:00', '12:00', '12:30', '14:00'];
        var stringDate = someDate.format("HH:mm");
        for (let i = 0; i < breakTimes.length; i++) {
            if (stringDate === breakTimes[i]) {
            return false;
            }
        }
        return true;
    }

    hourMaker(hour, minute) {
        var stringHour = '';
        var stringMinute = '';

        if(typeof(hour) === 'number') {
            stringHour = hour.toString();
        }

        if(typeof(hour) === 'number') {
            stringMinute =minute.toString();
        }

        if(stringHour.length < 2) {
            stringHour = '0' + stringHour;
        } 
        if(stringMinute.length < 2) {
            stringMinute = '0' + stringMinute;
        } 
        var result = stringHour + ':' + stringMinute;
        return result;
    }
}

module.exports = Methods;