const db = require("../services/connectDb");

async function getPersonDetails(id){
    return new Promise((resolve, reject) => {
        db.query('select * from person where id = ?', [id], (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        })
    });
}

async function getEventDetails(id){
    return new Promise((resolve, reject) => {
        db.query('select * from events where event_id = ?', [id], (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        })
    });
}

async function getRegistredEvents(person_id){

    return new Promise((resolve, reject) => {
        db.query('select * from bookings where person_id = ?', 
            [event_id, person_id], (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        })
    });
}

async function checkIfRegistered(event_id, person_id){
    
    return new Promise((resolve, reject) => {
        db.query('select * from bookings where person_id = ? and event_id = ?', 
            [person_id, event_id], (err, result) => {
            if(err)
                reject(err);
            resolve(true);
        })
    });
}

module.exports = getPersonDetails;
module.exports = getEventDetails;
module.exports = getRegistredEvents;
module.exports = checkIfRegistered;
