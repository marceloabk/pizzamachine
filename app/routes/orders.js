const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const knex = require('../db/connection')

router.use(bodyParser.urlencoded({
  extended: true,
}))

router.use(bodyParser.json())

router.get('/all_orders', (req, res) => {

    knex.select('ORDER.id', 'name', 'price', 'is_ready').from('ORDER').leftOuterJoin('USER', 'ORDER.user_id' ,'USER.id').orderBy('date_time')
    .then((orders) => {
      res.send(orders)
    })
    .catch((err) => { console.log(err); throw err })
})

module.exports = router