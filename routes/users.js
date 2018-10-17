const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const knex = require('../db/connection');
const Person = require('../models/person');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

router.get('/list', (req, res) => {

  var list = []
  knex.select().table('person') //mayber filter by 'role'
    .then(function (rows) {
      list = rows
      console.log(list)
      res.render('pages/users_list', {users:list});
    }).catch((err) => { console.log( err); throw err });
});

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

  if(newUser.isValid()){
    newUser.saveUser(newUser);
    // saveUser(data);
    res.redirect('/');
  }else{
		console.log('Usuário inválido');
	};
});


module.exports = router;
