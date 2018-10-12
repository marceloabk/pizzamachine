const router = require('express').Router();

// auth login
router.get('/login', (req, res) => {
    //res.render('login', { user: req.user });
    res.send('logging');
});

// auth logout
router.get('/logout', (req, res) => {
    // handle with passport
    res.send('logging out');
});

// auth with google+
router.get('/google', (req, res) => {
  res.send('logging with google');
});

module.exports = router;
