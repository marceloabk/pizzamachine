const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
require('dotenv').load()
// const keys = require('./keys');

passport.use(
  new GoogleStrategy({
    // options for google strategy
    callbackURL: '/auth/google/redirect',
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }, (accessToken, refreshToken, profile, done) => {
   // passport callback function
   console.log(`User: ${profile.displayName}.`);
   console.log(`E-mail: ${profile.emails[0].value}.`);
   console.log('passport callback function fired');
  })
) 