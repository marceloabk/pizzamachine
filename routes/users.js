const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const { Client } = require('pg');
const knex = require('../db/connection');

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

	if(validUser(req.body.user)){
    var data = req.body.user;
    saveUser(data);
    res.redirect('/');
  }else{
		console.log('Usuário inválido');
	};
});

function saveUser(data){

  const client = new Client({
    user: 'postgres',
    host: 'db'
  })

  const PORT = process.env.PORT || 5000;
  (async function(){
    await client.connect()
    const res = await client.query("INSERT INTO PERSON(role, name, email, password) VALUES ($1, $2, $3, $4)",
                ['client', data.name.trim(), data.email.trim(), data.password.trim()]);
    await client.end()
    console.log('Usuário salvo com sucesso');
  })().catch(e => console.error(e.stack));

}

function validUser(user) {
	return typeof user.email == 'string' &&
					user.email.trim() != '' &&
          checkRegistredEmail(user.email) != false &&
					typeof user.name == 'string' &&
					user.name.trim() != '' &&
					typeof user.password == 'string' &&
					user.password.trim() != '' &&
					user.password.trim().length >= 5 &&
					user.password == user.password;
}

function checkRegistredEmail(email){
  // fetching users with the same email
  knex.select().table('person').where('email', email)
    .then((rows) => {
      console.log(rows.length)
      if(rows.length > 0){
        return false;
      }else {
        return true;
      }
    }).catch((err) => { console.log( err); throw err });
}

module.exports = router;
