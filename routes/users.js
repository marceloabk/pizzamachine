const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const knex = require('../db/connection');
const Person = require('../models/person');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

router.get('/register', (req, res) => {
	res.render('pages/sign_in');
});

router.post('/register', (req, res) =>{
  // TODO:
  // hash the password

  var data = req.body.user;
  newUser = new Person('client');
  newUser.setName(data.name);
  newUser.setEmail(data.email);
  newUser.setPassword(data.password); // HASH THIS!!

  console.log(newUser.name);
  console.log(newUser.email);
  console.log(newUser.password);
  console.log(newUser.role);

  if(newUser.isValid()){
    newUser.saveUser(newUser);
    // saveUser(data);
    res.redirect('/');
  }else{
		console.log('Usuário inválido');
	};
});


module.exports = router;
