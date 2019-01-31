const express = require('express');
const mongoose = require('mongoose');
const Payment = require('../models/payment');


const router = express.Router();

//get payments
router.get('/',async (req,res) => {
    let params = {};
    params.skip = parseInt(req.query['skip']);
    params.limit = parseInt(req.query['limit']);
    params.sort = {};
    let sortDir = (req.query['sortDir'] == 'asc') ? 1 : -1;
    params.sort[req.query['sortBy']] = sortDir;

    Payment.find({},null,params, (err, results) => {
        //todo: add error handling
        if(results)
            res.send(results);
        else{
            res.send([]);
        }
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