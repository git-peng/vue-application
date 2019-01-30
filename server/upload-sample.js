const express = require('express');
const mongoose = require('mongoose');

const Payment = require('./models/payment');

const fs = require('fs');

//read config
var configFile;

try{
    configFile= fs.readFileSync('config.json');
}
catch (err){
    throw new Error('There was a problem reading config.json.')
}

//read sample data

try {
    dataFile = fs.readFileSync('sampledata.json');
}
catch (err){
    throw new Error('There was a problem reading sampledata.json ' + err);
}

let configData = JSON.parse(configFile).database;
let sampleData = JSON.parse(dataFile);

//connect to the database

let dbLocation = configData.dbaddress;

mongoose.connect('mongodb://' + configData.user + ":" + configData.password + "@" + dbLocation, 
    {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', (er) => {
    console.log('Failed to connect to database '+er);
});

db.once('open', () => {
    console.log('Successfully connected to database');

    uploadDataToDatabase();
});

function uploadDataToDatabase(){

    let samplePayments = [];

    for(var i in sampleData){
        let c = sampleData[i];
        console.log(c);
        let payment = new Payment({
            ID: c.ID,
            Name: c.Name,
            Description: c.Description,
            Date: c.Date,
            Amount: c.Amount
        });
        samplePayments.push(payment);
    };
    Payment.create(samplePayments, (err, payments) => {
        if(err){
            console.log(err);
        }
        else{
            console.log('Sample data successfully added');
        }
    });
}

db.close();