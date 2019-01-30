const mongoose = require('mongoose');

let paymentSchema = mongoose.Schema({
    ID: String,
    Name: String,
    Description: String,
    Date: Date,
    Amount: Number
});

let Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;