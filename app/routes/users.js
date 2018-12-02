const express = require('express')

const router = express.Router()
const bodyParser = require('body-parser')
const knex = require('../db/connection')
const User = require('../models/user')
// const bcrypt = require('bcrypt');

router.use(bodyParser.urlencoded({
  extended: true,
}))

router.use(bodyParser.json())

router.get('/list', (req, res) => {
  var u_name = req.session.name
  let list = []
  knex.select().table('USER').orderBy('name') // mayber filter by 'role'
    .then((rows) => {
      list = rows
      res.render('pages/users_list', { users: list, u_name })
    })
    .catch((err) => { console.log(err); throw err })
})

router.get('/register', (req, res) => {
  var u_name = req.session.name
  res.render('pages/sign_in', {u_name})
})

router.post('/register', (req, res) => {
  const data = req.body.user
  const user = new User('client', data.name, data.email, data.phone, '', data.socialId, data.socialUserId)

  user.setPassword(data.password)
  user.saveUser()

  res.redirect('/')
})

router.get('/register/employee', (req, res) => {
  var u_name = req.session.name
  res.render('pages/sign_in_employee', {u_name})
})

router.post('/register/employee', (req, res) => {
  const data = req.body.user

  const user = new User('employee', data.name, data.email, '', data.socialId, data.socialUserId)

  user.setPassword(data.password)
  user.saveUser()

  res.redirect('/')
})

router.get('/delete/:user_id', (req, res) => {
  // validate autentication to delete other users

  const user_id = req.params.user_id
  console.log(`Removendo usuário de id: ${user_id}`)

  knex('USER').where('id', user_id).del()
    .then(() => { console.log(`Usuário removido ${user_id}`) })
    .catch((err) => { console.log(err); throw err })

  // console.log(req.get('referer'))
  res.redirect(req.get('referer'))
})

router.get('/edit/:user_id', (req, res) => {
  // validate autentication to edit other users
  var u_name = req.session.name

  const user_id = req.params.user_id

  let user
  knex.select().from('USER').where('id', user_id).first()
    .then((query) => {
      user = query
      console.log(user.name)
      res.render('pages/edit', { user, u_name })
    })
    .catch((err) => { console.log('Usuário inexistente'); console.log(err) })
})

router.post('/edit/:user_id', (req, res) => {
  // validate autentication to edit other users

  const user_id = req.params.user_id
  const data = req.body.user

  const new_name = data.name
  const new_email = data.email
  const new_phone = data.phone

  console.log(new_name)

  knex('USER').where('id', user_id).update({
    name: new_name,
    email: new_email,
    phone: new_phone,
  })
    .then(() => {
      res.redirect('/users/list')
    })
    .catch((err) => { console.log(`erro${err}`) })
})

// exports.userCreation = function userCreation(role, data){
//   const saltRounds = 10; // rounds of hashing

//   newUser = new User(role, data.name, data.email, '', data.socialId, data.socialUserId);

//   bcrypt.hash(data.password, saltRounds, function(err, hash) {
//     newUser.setPassword(hash);
//     if(newUser.isValid()){
//       newUser.saveUser(newUser);
//     }else{
//       console.log('Dados de funcionário inválidos');
//     }
//   });

// }

module.exports = router
