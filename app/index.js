const path = require('path')

// const usersRouter = require("./routes/users")
// const makePizza = require('./routes/make_pizza')
const session = require('express-session');
const express = require('express')
const knex = require('./db/connection')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const usersRouter = require('./routes/users')
const authRoutes = require('./routes/auth-routes')
const ordersRoutes = require('./routes/orders')
require('./config/passport-setup')
require('dotenv').load()
const stripe = require("stripe")(process.env.SK_STRIPE);
const crypto = require('crypto')


const PORT = process.env.PORT || 5000
let isRaspConnected = false

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(session({
  secret: 'ssshhhhh',
  resave: true,
  saveUninitialized: false
}));
// this is secret is just for cookie reasons

app.use(express.urlencoded({
  extended: true
}));

var sess;

app.get('/', async(req, res) => {
  sess = req.session;
  console.log(sess)
  var u_name = req.session.name
  console.log(u_name)
  try {
    let pizzas = await knex.select().table('PIZZA').orderBy('id')
    let pizza_ingredient = await knex.select().table('PIZZA_INGREDIENT').orderBy('id')

    for (let i = 0; i < pizzas.length; i++) {
      pizzas[i].ingredients = []
    }

    for (let i = 0; i < pizzas.length; i++) {
      for (let j = 0; j < pizza_ingredient.length; j++) {
        if (pizzas[i].id == pizza_ingredient[j].pizza_id) {
          let ingredient = await knex.select().table('INGREDIENT').where('id', pizza_ingredient[j].ingredient_id).first()
          pizzas[i].ingredients.push(ingredient)
        }
      }
    }

    res.render('pages/index', { pizzas, order, u_name})
  } 
  catch(err) {
    console.log(err); throw err
  }
})


app.get('/login', (req, res) => {
  var u_name = req.session.name
  res.render('pages/login', {u_name})
})

app.get('/logout', (req, res) => {
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
})

app.post('/login', async (req, res) => {
  sess = req.session;
  user_email = req.body.user.email
  
  //buscando usuário no banco
  var user = await knex.select().from('USER').where('email', user_email ).first()
  
  if ( typeof user == 'undefined'){
    console.log('Email não encontrado');
    res.redirect('/login');
  }else{
    // checking password
    var pw = await knex.select('password').from('USER').where('id', user.id ).first()
    
    var ent_pw = crypto.createHmac('sha256', process.env.HASH_SECRET)
                  .update(req.body.user.password)
                  .digest('hex')
    
    if (pw.password == ent_pw){
      console.log('Login realizado com sucesso')

      var user_name = await knex.select('name').from('USER').where('email', user_email ).first()
      var user_id = await knex.select('id').from('USER').where('email', user_email ).first()
      sess.cookie.id = user_id.id
      sess.name = user_name.name
      sess.email= req.body.user.email;

      req.session.cookie.expires = false;

      console.log('Bem-vindo, ' + user_name.name + ' de id ' + user_id.id)

      req.session.save(function(err) {
        console.log('session saved')
      })
      
    }else{
      console.log('Senha Incorreta');
      res.redirect('/login');
    }
  }
 
  res.redirect('/');
})

app.get('/orders', async (req, res) => {
  var u_name = req.session.name
  try {
    let orders = await knex.select('ORDER.id', 'name', 'price', 'is_ready').from('ORDER')
      .leftOuterJoin('USER', 'ORDER.user_id' ,'USER.id').orderBy('date_time')

    res.render('pages/orders', { orders, u_name })
  }
  catch(err) { 
    console.log(err); throw err 
  }
})

app.post('/order', async (req, res) => {

  // getting the user id
  
  sess = req.session;
  if (sess.email){
    console.log('usuário logado')
  }else{
    res.redirect('/login');
  }

  var user = await knex.select().from('USER').where('email', sess.email ).first()
  var user_id = user.id
 

  console.log('Body no create-order ==============')
  console.log(req.body.dpizza);
  
  // const pi = JSON.parse(req.body)
  // console.log(JSON.parse(req.body.dpizza))

  // Token is created using Checkout or Elements!
  // Get the payment token ID submitted by the form:
  const token = req.body.stripeToken; // Using Express
  const chargeAmount = req.body.chargeAmount
  const description = req.body.description
  // JSON.stringify

  const charge = stripe.charges.create({
    amount: chargeAmount,
    currency: 'BRL',
    description: description,
    source: token,
  })
  .catch((err) => { console.log(err); throw err });

  const pizza = JSON.parse(req.body.dpizza)

  try {
    await knex('ORDER').insert({
      price: pizza.ingredients.reduce((total, atual) => total + atual.price, 0).toFixed(2),
      user_id: user_id,
      pizza_id: pizza.id,
      is_ready: false,
      date_time: new Date(),
    })

    let order = await knex.select().from('ORDER').where('is_ready', false).orderBy('date_time')

    if (order.length === 1) {
        waitRaspConnect(function(){
	  io.emit('updatedDb', '')
	})
    }
    // res.json(pizza)
    res.redirect('/orders')
  }
  catch(err) { 
    console.log(err); throw err 
  }
})

app.use('/auth', authRoutes)
app.use('/users', usersRouter)
app.use('/orders', ordersRoutes)


io.on('connection', function(socket){
  console.log('a user connected')
  isRaspConnected = true
  socket.on('disconnect', function(){
    console.log('user disconnected')
    isRaspConnected = false
  })
  socket.on('askOrder', async function(){
    console.log('Quero uma pizza')
    
    let order = await knex.select().from('ORDER').where('is_ready', false).orderBy('date_time').first()

    if (order) {
      socket.emit('getOrder',  {"order": order}, async function(order_back) {
        console.log(JSON.stringify(order_back))
  
        await knex('ORDER').where('id', '=', order_back.order.id)
          .update({
            is_ready: true
        })
  	
        setTimeout(function (){
            socket.emit('updatedDb', '')
        },30000)
        
      })
    } 
  })
})

const server = http.listen(PORT, () => console.log(`Such pizza on ${PORT}`))

let order = ['order test']

function waitRaspConnect(callback) {
    if (isRaspConnected) {
        callback()
    } else {
        setTimeout(function(){
	    waitRaspConnect(callback)
        }, 5000)
    }
}

module.exports = server
