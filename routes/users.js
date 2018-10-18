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
  newUser = new Person('client'); //Create the case of signning in a employee
  newUser.setName(data.name);
  newUser.setEmail(data.email);
  newUser.setPassword(data.password); // HASH THIS!!

  if(newUser.isValid()){
    newUser.saveUser(newUser);
    res.redirect('/');
  }else{
		console.log('Usuário inválido');
	};
});

router.delete('/delete/:user_id', (req, res) =>{
  console.log(user_id)
  // knex.select().table('person').where('id', user_id) //mayber filter by 'role'
  // .then(function (rows) {
  //   console.log('Found him!')
  // }).catch((err) => { console.log( err); throw err });

});


module.exports = router;
