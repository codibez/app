const express = require('express');
const validate = require('../controllers/indexController.js');

const router = express.Router();

// show index page
router.get('/', validate);
router.get('/validate', validate);
router.post('/validate', validate);

module.exports = router;