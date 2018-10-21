const express = require('express')
const path = require('path')
const authRoutes = require('./routes/auth-routes')
const passportSetup = require('./config/passport-setup')
const { Client } = require('pg')
const usersRouter = require("./routes/users");

const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'pizza'
})

const PORT = process.env.PORT || 5000;

(async function(){
  await client.connect()

  const res = await client.query('SELECT $1::text as message', ['Hello world!'])
  console.log(res.rows[0].message) // Hello world!
  await client.end()

})();

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/login', (req, res) => res.render('pages/login'))
  .use('/auth', authRoutes)
  .use('/users', usersRouter)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
