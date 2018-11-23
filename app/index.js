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

app.get('/', (req, res) => {
  res.render('pages/index', { ingredients, pizzas, order })
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.get('/orders', (req, res) => {
  let list = []
  knex.select('ORDER.id', 'name', 'price', 'is_ready').from('ORDER').leftOuterJoin('USER', 'ORDER.user_id' ,'USER.id').orderBy('date_time')
  .then((rows) => {
    list = rows
    res.render('pages/orders', { orders: list })
  })
  .catch((err) => { console.log(err); throw err })
})


app.post('/order', (req, res) => {
  const pizza = req.body.pizza

//  io.sockets.emit('rasp', JSON.stringify(pizza), function(msg) {
//    console.log(msg)
//   })

  gSocket.emit('rasp', JSON.stringify(pizza), function(msg) {
    console.log(msg)
  })

  res.json(pizza)
})

app.use('/auth', authRoutes)
app.use('/users', usersRouter)
app.use('/orders', ordersRoutes)

var gSocket
io.on('connection', function(socket){
  console.log('a user connected')
  gSocket = socket
  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
})

const server = http.listen(PORT, () => console.log(`Such pizza on ${PORT}`))


// Subistituir por ingredientes do banco
const ingredients = [
  { id: 1, name: 'Massa', price: 1.00 },
  { id: 2, name: 'Molho', price: 0.25 },
  { id: 3, name: 'Mussarela', price: 0.50 },
  { id: 4, name: 'Presunto', price: 0.50 },
  { id: 5, name: 'Orégano', price: 0.25 }  
]

const pizzas = [
  { 
    id: 0,
    name: 'Mussarela',
    ingredients: ingredients.filter(i => [1, 2, 3].includes(i.id)) 
  },
  { 
    id: 1,
    name: 'Presunto',
    ingredients: ingredients.filter(i => [1, 2, 4].includes(i.id))
  },
  { 
    id: 2,
    name: 'Mussarela com orégano',
    ingredients: ingredients.filter(i => [1, 2, 3, 5].includes(i.id))  
  },
  { 
    id: 3,
    name: 'Presunto com orégano',
    ingredients: ingredients.filter(i => [1, 2, 4, 5].includes(i.id)) 
  },
  { 
    id: 4,
    name: 'Mussarela e presunto',
    ingredients: ingredients.filter(i => [1, 2, 3, 4].includes(i.id)) 
  },
  { 
    id: 5,
    name: 'Mussarela e presunto com orégano',
    ingredients: ingredients.filter(i => [1, 2, 3, 4, 5].includes(i.id)) 
  }
]


let order = ['order test']

module.exports = server
