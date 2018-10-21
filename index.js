const path = require('path')
const authRoutes = require('./routes/auth-routes')
const usersRouter = require('./routes/users')
const passportSetup = require('./config/passport-setup')
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

const PORT = process.env.PORT | 5000

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('pages/index')
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

http.listen(PORT, () => console.log(`Such pizza on ${ PORT }`))
