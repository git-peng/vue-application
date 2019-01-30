const express = require('express');
const mongoose = require('mongoose');
const Payment = require('../models/payment');


const router = express.Router();

//get payments
router.get('/',async (req,res) => {
    Payment.find({},null,{skip: req['start'], limit: req['count']}, (results) => {
        res.send(results.toArray());
    }, (err) => {
        res.send(err);
    });
});

router.post('/', async (req,res) => {
    //new payment
    res.status(201).send('new payment');
});

router.put('/', async (req, res) => {
    //edit payment
    res.send('edit payment');
});



async function loadDB(){
    const client = "";
}

module.exports = router;