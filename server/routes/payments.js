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
    let search = {};
    if(req.query.searchText && req.query.searchField){
        search[req.query.searchField] = {$regex: new RegExp( req.query.searchText, 'i')};
    }
    Payment.find(search,null,params, (err, results) => {

        let response = {};
        response.data = results;
         //todo: add error handling
        if (!results){
            response.count = 0;
            res.send(response);
        }
        else Payment.countDocuments(search, (err, results) => {
            response.count = results;
            res.send(response);
        });
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