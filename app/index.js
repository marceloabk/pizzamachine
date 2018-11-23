const path = require('path')

// const usersRouter = require("./routes/users")
// const makePizza = require('./routes/make_pizza')

const express = require('express')
const knex = require('./db/connection')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const usersRouter = require('./routes/users')
const authRoutes = require('./routes/auth-routes')
const ordersRoutes = require('./routes/orders')
require('./config/passport-setup')

const PORT = process.env.PORT || 5000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', async(req, res) => {
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

    res.render('pages/index', { pizzas, order })
  } 
  catch(err) {
    console.log(err); throw err
  }
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.get('/orders', async (req, res) => {
  try {
    let orders = await knex.select('ORDER.id', 'name', 'price', 'is_ready').from('ORDER')
      .leftOuterJoin('USER', 'ORDER.user_id' ,'USER.id').orderBy('date_time')

    res.render('pages/orders', { orders })
  }
  catch(err) { 
    console.log(err); throw err 
  }
})

app.post('/order', async (req, res) => {
  const pizza = req.body.pizza

  try {
    await knex('ORDER').insert({
      price: pizza.ingredients.reduce((total, atual) => total + atual.price, 0).toFixed(2),
      user_id: 1,
      pizza_id: pizza.id,
      is_ready: false,
      date_time: new Date(),
    })
  }
  catch(err) { 
    console.log(err); throw err 
  }

  res.json(pizza)
})

app.use('/auth', authRoutes)
app.use('/users', usersRouter)
app.use('/orders', ordersRoutes)

var gSocket
var pi = 0 
io.on('connection', function(socket){
  console.log('a user connected')
  gSocket = socket
  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
  socket.on('askOrder', function(){
    console.log('Quero uma pizza')
    socket.emit('getOrder',  {"id": ++pi}, function(msg) {
      console.log(msg)
    })
  })
})

const server = http.listen(PORT, () => console.log(`Such pizza on ${PORT}`))

let order = ['order test']

module.exports = server
