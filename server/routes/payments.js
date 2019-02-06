const express = require('express');
const mongoose = require('mongoose');

const Payment = require('../models/payment');


const router = express.Router();

//get payments
router.get('/',async (req,res) => {
    let params = {};

    //set parameters for pagination
    params.skip = parseInt(req.query['skip']);
    params.limit = parseInt(req.query['limit']);
    params.sort = {};

    //set parameters for sorting
    let sortDir = (req.query['sortDir'] == 'asc') ? 1 : -1;
    params.sort[req.query['sortBy']] = sortDir;

    //searching
    let search = {};
    if(req.query.searchText && req.query.searchField){
        search['$and'] = [];
        search['$and'].push({[req.query.searchField]:{$regex: new RegExp( req.query.searchText, 'i')}});
    }
    if(req.query.filters){
        let filters = {};
        try{
            if(!search['$and'])
                search['$and'] = [];
            filters = JSON.parse(req.query.filters);

            if(filters['Amount']){
                let f = {'Amount': {}};
                if(filters['Amount'].max)
                    f['Amount']['$lte'] = parseInt(filters['Amount'].max);
                if(filters['Amount'].min)
                    f['Amount']['$gte'] = parseInt(filters['Amount'].min);
                search['$and'].push(f);
            }
            if(filters['Date']){
                let f = {'Date': {}};
                if(filters['Date'].before)
                    f['Date']['$lte'] = new Date(filters['Date'].before);
                if(filters['Date'].after)
                    f['Date']['$gte'] = new Date(filters['Date'].after);    
                search['$and'].push(f);
            }

            
        }
        catch(err){
            //JSON isn't right, log and ignore so the request still goes through
            console.log(err);
        }
    }
    console.log(search);
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

router.put('/description', async (req, res) => {
    let params = req.body;
    let payment = params.payment;

    //edit payment
    Payment.findOneAndUpdate({_id: payment._id},{Description: payment.Description}, (err, payment) => {
        if(err){
            res.send(err);
        }
        else{
            res.send(payment);
        }
    });
});



async function loadDB(){
    const client = "";
}

module.exports = router;