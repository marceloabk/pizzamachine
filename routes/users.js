const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const knex = require('../db/connection');
const User = require('../models/user');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

router.get('/list', (req, res) => {
  var list = []
  knex.select().table('USER').orderBy('name') //mayber filter by 'role'
    .then(function (rows) {
      list = rows
      res.render('pages/users_list', {users:list});
    }).catch((err) => { console.log( err); throw err });
});

router.get('/register', (req, res) => {
	res.render('pages/sign_in');
});

router.post('/register', (req, res) =>{

  var data = req.body.user;
  userCreation('client', data, res)
});

router.get('/register/employee', (req, res) => {
	res.render('pages/sign_in_employee');
});

router.post('/register/employee', (req, res) =>{

  var data = req.body.user;
  userCreation('employee', data, res)
});

router.get('/delete/:user_id', (req, res) =>{
  //validate autentication to delete other users

  var user_id = req.params.user_id;
  console.log('Removendo usuário de id: ' + user_id);

  knex('USER').where('id', user_id).del()
  .then(()=>{console.log('Usuário removido ' + user_id)})
  .catch((err) => { console.log( err); throw err });

  //console.log(req.get('referer'))
  res.redirect(req.get('referer'));

});

router.get('/edit/:user_id', (req, res) =>{
  //validate autentication to edit other users

  var user_id = req.params.user_id;

  var user;
  var name, email, phone = '';
  knex.select().from('USER').where('id', user_id).first()
  .then((query) => {
    user = query;
    console.log(user.name);
    res.render('pages/edit', {user: user});
  })
  .catch((err) => {console.log('Usuário inexistente')});
});

router.post('/edit/:user_id', (req, res) =>{
  //validate autentication to edit other users

  var user_id = req.params.user_id;
  var data = req.body.user;

  var new_name = data.name;
  var new_email = data.email;
  var new_phone = data.phone;

  console.log(new_name);

  knex('USER').where('id', user_id).update({
    name: new_name,
    email: new_email,
    phone: new_phone
  })
  .then(() => {
    res.redirect('/users/list')
  })
  .catch((err) => {console.log('erro' + err)});
});

function userCreation(role, data, res){
  newUser = new User(role); //Create the case of signning in a employee
  newUser.setName(data.name);
  newUser.setEmail(data.email);
  newUser.setPassword(data.password); // HASH THIS!!

  if(newUser.isValid()){
    newUser.saveUser(newUser);
    res.redirect('/');
  }else{
    console.log('Dados de funcionário inválidos');
  }
}

module.exports = router;
