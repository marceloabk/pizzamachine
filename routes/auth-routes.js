const router = require('express').Router();
const passport = require('passport');

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
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// callback route to google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.send('you reach the callback uri');
});

module.exports = router;
