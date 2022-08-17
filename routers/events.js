const express = require('express');
const db = require('../services/connectDb');
const router = express.Router();

router.get('/get-event-list', (req, res) => {

    db.query('select * from events', (err, result) => {

        if(err){
            console.error(err);
            return res.sendStatus(500);
        }

        return res.status(200).json(result);
    });
});

module.exports = router;