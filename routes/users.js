const express = require('express');
const router = express.Router();


router.get('/register', (req, res) => {
	res.render('pages/sign_in');
});

module.exports = router;
