const router = require('express').Router();

// Subistituir por ingredientes do banco
const ingredients = [
  {id: 1, name: 'Pão', price: 1.00},
  {id: 2, name: 'Molho', price: 0.25},
  {id: 3, name: 'Mussarela', price: 0.50},
  {id: 4, name: 'Calabresa', price: 0.50},
  {id: 5, name: 'Presunto', price: 0.50},
  {id: 6, name: 'Frango', price: 0.50},
  {id: 7, name: 'Tomate', price: 0.25},
  {id: 8, name: 'Pimentão', price: 0.25},
  {id: 9, name: 'Catupiri', price: 0.25},
  {id: 10, name: 'Milho', price: 0.25},
];

router.get('/', (req, res) => {
  res.render('pages/make_pizza', {ingredients: ingredients})
})

module.exports = router;