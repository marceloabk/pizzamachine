const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const { Client } = require('pg')

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
  // validate email uniqueness

  const client = new Client({
    user: 'postgres',
    host: 'db'
  })

	if(validUser(req.body.user)){
    const data = req.body.user;
    const PORT = process.env.PORT || 5000;
    (async function(){
      await client.connect()
      const res = await client.query('INSERT INTO PERSON(role, name, email, password) VALUES ($1, $2, $3, $4)',
                  ['client', data.name.trim(), data.email.trim(), data.password.trim()]);
      await client.end()
    })().catch(e => console.error(e.stack));

  }else{
		console.log('Usuário inválido')
	};
});

function validUser(user) {
	return typeof user.email == 'string' &&
					user.email.trim() != '' &&
					typeof user.name == 'string' &&
					user.name.trim() != '' &&
					typeof user.password == 'string' &&
					user.password.trim() != '' &&
					user.password.trim().length >= 5 &&
					user.password == user.password;
}

module.exports = router;
