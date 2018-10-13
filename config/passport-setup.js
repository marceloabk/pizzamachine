const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const FacebookStrategy = require('passport-facebook');

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
   console.log('passport google callback function fired');
  })
) 

passport.use(
  new FacebookStrategy({
    // options for facebook strategy
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/redirect',
    profileFields: ['id', 'displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
   // passport callback function
   console.log(`User: ${JSON.stringify(profile)}.`);
   console.log('passport facebook callback function fired');
  })
) 