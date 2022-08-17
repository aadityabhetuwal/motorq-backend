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
            [person_id], (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        })
    });
}

async function checkIfRegistered(event_id, person_id){
    
    return new Promise((resolve, reject) => {

        const qry = db.format('select * from bookings where person_id = ? and event_id = ?', 
        [person_id, event_id]);

        db.query(qry, (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        })
    });
}

async function getWaitList(event_id, person_id){
    
    return new Promise((resolve, reject) => {

        const qry = db.format('select * from wait_list group by designation order by time desc');

        db.query(qry, (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        })
    });
}

async function insertWaitList(event_id, person_id, designation){
    return new Promise((resolve, reject) => {


        db.query('insert into wait_list(person, event, designation) values(?, ?, ?)', 
            [person_id, event_id, designation], 
            (err, result) => {
            if(err)
                reject(err);
            resolve(result);
        })
    });
}

async function insertBooking(person_id, event_id) {
    return new Promise((resolve, reject) => {
         
        db.query('insert into bookings(event_id, person_id) values(?, ?)', [event_id, person_id], 
        (err, result) => {
            if(err) reject(err);
            resolve(result); 
        });
    });
}

exports.getPersonDetails = getPersonDetails;
exports.getEventDetails = getEventDetails;
exports.getRegistredEvents = getRegistredEvents;
exports.checkIfRegistered = checkIfRegistered;
exports.getWaitList = getWaitList;
exports.insertWaitList = insertWaitList;
