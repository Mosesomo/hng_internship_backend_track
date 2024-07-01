const express = require('express');
const greetVisitor = require('../controllers/controller');

const router = express.Router();

router.get('/hello', greetVisitor);


module.exports = router;