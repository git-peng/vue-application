const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.send('hi');
});

module.exports = router;