const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const getPersonDetails = require('../functions/getDetails');
const getEventDetails = require('../functions/getDetails');
const getRegistredEvents = require('../functions/getDetails');
const checkIfRegistered = require('../functions/getDetails');
jsonParser = bodyParser.json();

router.post('/register-for-event', jsonParser, async (req, res) => {

    const { event_id, person_id } = req.body;

    if(event_id === null || person_id === null){
        return res.status(400).json({
            error : 'Please have valid parameters'
        });
    }

    
    try{
        const isRegistered = await checkIfRegistered(event_id, person_id);

        if(isRegistered){
            return res.status(400).json({
                error : "You have already registred for this event"
            });
        }

        const personDetails = await getPersonDetails(person_id);
        const eventDetails = await getEventDetails(event_id);

        const registeredByPerson = await getRegistredEvents(person_id);

        // check if capacity is full else 
        return res.sendStatus(200);
    }catch(err){
        console.error(err);
        return res.sendStatus(500);
    }

});

module.exports = router;