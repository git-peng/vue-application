"use strict";

const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors());

const port = process.env.PORT || 8081;

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname + '/public'));

    app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'));
}

//start up


//read config
var configFile;

try{
    configFile= fs.readFileSync('config.json');
}
catch (err){
    console.log('There was a problem reading config.json  Check the readme file for more info')
}

let configData = JSON.parse(configFile).database;

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
});

const api = require("./routes/payments");
//const routes = require("./routes/routes");



app.use('/api/payments', api);
//app.use('/', routes);



app.listen(port, () => console.log('hello'));