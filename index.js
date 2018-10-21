const path = require('path')
const authRoutes = require('./routes/auth-routes')
const passportSetup = require('./config/passport-setup')
const usersRouter = require("./routes/users")

const express = require('express')
const app =  express()

const PORT = process.env.PORT | 5000

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('pages/index')
})
app.get('/login', (req, res) => {
  res.render('pages/login')
})

app.use('/auth', authRoutes)
app.use('/users', usersRouter)

app.listen(PORT, () => console.log(`Such pizza on ${ PORT }`))
