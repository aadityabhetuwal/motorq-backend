const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { getPersonDetails, getEventDetails, getRegistredEvents, checkIfRegistered, getWaitList, insertWaitList } 
    = require('../functions/getDetails');

const moment = require('moment');
const db = require('../services/connectDb');
const { resume } = require('../services/connectDb');
const { devNull } = require('os');

jsonParser = bodyParser.json();


function getStartAndEnd(eventDetails){
    const eventStart = eventDetails.time;
    const duration = eventDetails.duration;

    let a = duration.split(':');
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); 

    const eventEnd = new Date(eventStart.getTime() + seconds * 1000);
    return [eventStart, eventEnd];
}

router.post('/register-for-event', jsonParser, async (req, res) => {

    const { event_id, person_id } = req.body;

    if(event_id === null || person_id === null){
        return res.status(400).json({
            error : 'Please have valid parameters'
        });
    }

    
    try{
        const isRegistered = await checkIfRegistered(event_id, person_id);

        if(isRegistered.length > 0){
            return res.status(400).json({
                error : "You have already registred for this event"
            });
        }

        const personDetails = await getPersonDetails(person_id);
        const eventDetails = await getEventDetails(event_id);
        
        if(eventDetails.capacity === 0){
            try{
                const det = await insertWaitList(event_id, person_id, personDetails[0].designation);
            }catch(err){
                return res.status(400).json({
                    error: "couldn't add into waitlist"
                });
            }

            return res.status(400).json({
                error : 'Event is full. You have been placed in the waiting list'
            })
        }

        const registeredByPerson = await getRegistredEvents(person_id);
        const [eventStart, eventEnd] = getStartAndEnd(eventDetails[0]);

        console.log(registeredByPerson);
        // check if capacity is and slots do not clash
        
        for(let i = 0; i < registeredByPerson.length; i++){
            const currEvent = await getEventDetails(registeredByPerson[i].event_id);
            const [startT, endT] = getStartAndEnd(currEvent[0]);

            if(eventEnd >= startT){
                return res.status(400).json({
                    error : 'Slots clash and you cannot register'
                });
            }
        }

        // then register and patch capacity
        db.beginTransaction();

        db.query('insert into bookings(event_id, person_id) values(?, ?)', [event_id, person_id], 
            (err, result) => {

            if(err){
                console.error(err);
                db.rollback();
                return res.sendStatus(500);
            }

            //if successfull
            db.query('update events set capacity = capacity - 1 where event_id = ?', [event_id], 
                (err, result) => {
                
                if(err){
                    db.rollback();
                    console.error(err);
                    return res.sendStatus(500);
                }
                
                db.commit();

                return res.status(200).json({
                    message : `${personDetails[0].name} registered for event ${eventDetails[0].event_name}`
                });                
            });
        });

    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }

});


async function handleWaitList(){

    const waitList = await getWaitList();

    // insert first special guest or business person or professor or student
    let specialGuest = -1, business = -1, professor = -1, student = -1;

    for(let i = 0; i < waitList.length; i++){
        switch(waitList[i].designation){
            case 'Student':
                student = (student != -1) ? student : i;
                break;
            case 'Special Guest':
                specialGuest = (specialGuest != -1) ? specialGuest : i;
                break;
            case 'Professor':
                business = (business != -1) ? business : i;
                break;
            case 'Business Person':
                professor = (professor != -1) ? professor : i;
                break;
        }
    }

    if(specialGuest != -1){
        await insertWaitList(waitList[specialGuest].event_id, waitList[specialGuest].person_id, 
                )
    }
}

router.post('/cancel-event', jsonParser, async (req, res) => {

    const { event_id, person_id } = req.body;

    if(event_id == null || person_id == null){
        return res.status(400).json({
            error : 'Please have valid parameters'
        });
    }

    
    try{
        const isRegistered = await checkIfRegistered(event_id, person_id);

        console.log(isRegistered);

        if(isRegistered.length === 0){
            return res.status(400).json({
                error : "You are not registered to cancel this event"
            });
        }

    
       db.query('delete from bookings where event_id = ? and person_id = ?', 
            [event_id, person_id], (err, result) => {
                
                if(err){
                    console.error(err);
                    return res.sendStatus(500);
                }

                await handleWaitList();

                return res.status(200).json({
                    message : 'Booking succesfully deleted'
                });
        });

    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }

});

module.exports = router;