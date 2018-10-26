const path = require('path')
const authRoutes = require('./routes/auth-routes')
const usersRouter = require('./routes/users')
const passportSetup = require('./config/passport-setup')

const { Client } = require('pg')
// const usersRouter = require("./routes/users")
// const makePizza = require('./routes/make_pizza')

const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = process.env.PORT || 5000


app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('pages/index', {ingredients: ingredients, pizzas: pizzas})
})

app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.post('/order', (req, res) => {
  var pizza = req.body.pizza
  io.sockets.emit('rasp', JSON.stringify(pizza))
  res.json(pizza)
})

app.use('/auth', authRoutes)
app.use('/users', usersRouter)

var server = http.listen(PORT, () => console.log(`Such pizza on ${ PORT }`))


// Subistituir por ingredientes do banco
const ingredients = [
  {id: 0, name: 'Massa', price: 1.00},
  {id: 1, name: 'Molho', price: 0.25},
  {id: 2, name: 'Mussarela', price: 0.50},
  {id: 3, name: 'Calabresa', price: 0.50},
  {id: 4, name: 'Presunto', price: 0.50},
  {id: 5, name: 'Frango', price: 0.50},
  {id: 6, name: 'Tomate', price: 0.25},
  {id: 7, name: 'Pimentão', price: 0.25},
  {id: 8, name: 'Catupiry', price: 0.25},
  {id: 9, name: 'Milho', price: 0.25},
  {id: 10, name: 'Oregano', price: 0.25},
  {id: 11, name: 'Bakon', price: 0.50},
  {id: 12, name: 'Provolone', price: 0.50},
  {id: 13, name: 'Parmesão', price: 0.50},
  {id: 14, name: 'Manjericão', price: 0.25},
  {id: 15, name: 'Ovo', price: 0.50},
  {id: 16, name: 'Palmito', price: 0.25},
  {id: 17, name: 'Azeitona', price: 0.25},
  {id: 18, name: 'Cebola', price: 0.25},
  {id: 19, name: 'Peperoni', price: 0.50},
  {id: 20, name: 'Atum', price: 0.50},
  {id: 21, name: 'Bacalheu', price: 0.50},
  {id: 22, name: 'Carne de sol', price: 0.50},
];

const pizzas = [
  {
    id: 0, 
    name: 'Frango com catupiry', 
    ingredients: ingredients.filter(i => [0, 1, 2, 5].includes(i.id))
  },
  {
    id: 1, 
    name: 'Calabresa', 
    ingredients: ingredients.filter(i => [0, 1, 3, 10].includes(i.id))
  },
  {
    id: 2,
     name: '4 Queijos',
    ingredients: ingredients.filter(i => [0, 1, 2, 8, 12, 13].includes(i.id))
  },
  {
    id: 3,
    name: 'Portuguesa',
    ingredients: ingredients.filter(i => [0, 1, 2, 11, 6, 15, 18, 3, 17, 7, 10].includes(i.id)) 
  },
  {
    id: 4,
    name: 'Bakon',
    ingredients: ingredients.filter(i => [0, 1, 2, 11, 6, 10].includes(i.id))
  },
  {
    id: 5,
    name: 'Atum',
    ingredients: ingredients.filter(i => [0, 1, 2, 18, 20, 17, 10].includes(i.id))
  },
  {
    id: 6,
    name: 'Palmito',
    ingredients: ingredients.filter(i => [0, 1, 2, 16, 10].includes(i.id))
  },
  {
    id: 7,
    name: 'Marguerita',
    ingredients: ingredients.filter(i => [0, 1, 2, 6, 14, 10].includes(i.id))
  },
]

module.exports = server