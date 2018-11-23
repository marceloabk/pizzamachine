const knex = require('./connection')

console.log('Executando seeds para inserção de usuários fake.')

console.log('Inserindo clientes')
knex('USER').max('id').first()
  .then((user) => {
    if (user.max == null) { user.max = 1 }
    for (let aux = user.max; aux <= user.max + 10; aux++) {
      knex('USER').insert({
        role: 'client', name: `Cliente_FAKE_${aux}`, email: `c_fake${aux}@gmail.com`, phone: '332211', password: '123456',
      })
        .catch((err) => { console.log(err); throw err })
    }
  })
  .catch((err) => { console.log(err); throw err })


knex('USER').max('id').first()
  .then((user) => {
    if (user.max == null) { user.max = 1 }
    for (let aux = user.max; aux <= user.max + 5; aux++) {
      knex('USER').insert({
        role: 'employee', name: `Funcionário_FAKE_${aux}`, email: `e_fake${aux}@gmail.com`, phone: '332211', password: '123456',
      })
        .catch((err) => { console.log(err); throw err })
    }
  })
  .catch((err) => { console.log(err); throw err })

const ingredients = [
  { id: 1, name: 'Massa', price: 1.00 },
  { id: 2, name: 'Molho', price: 0.25 },
  { id: 3, name: 'Mussarela', price: 0.50 },
  { id: 4, name: 'Presunto', price: 0.50 },
  { id: 5, name: 'Orégano', price: 0.25 }  
]

console.log('Inserindo ingredientes...')

ingredients.forEach( i => {
  knex('INGREDIENT').select()
    .where('name', i.name)
    .then((rows) => {
      if (rows.length === 0) {
        knex('INGREDIENT').insert({
          id: i.id,
          name: i.name,
          price: i.price,
        }).catch((err) => { console.log(err); throw err })
      } else {
        console.log(`${i.name} já existe no banco.`)
      }
    })
    .catch((err) => { console.log(err); throw err })
})

console.log('Ingredientes inseridos.')

const pizzas = [
  { id: 1, name: 'Mussarela' },
  { id: 2, name: 'Presunto' },
  { id: 3, name: 'Mussarela com orégano' },
  { id: 4, name: 'Presunto com orégano' },
  { id: 5, name: 'Mussarela e presunto' },
  { id: 6, name: 'Mussarela e presunto com orégano' }
]

pizzas.forEach((i) => {
  knex('PIZZA').select()
    .where('name', i.name)
    .then((rows) => {
      if (rows.length === 0) {
        knex('PIZZA').insert({
          id: i.id,
          name: i.name,
        }).catch((err) => { console.log(err); throw err })
      } else {
        console.log(`${i.name} já existe no banco.`)
      }
    })
    .catch((err) => { console.log(err); throw err })
})

const pizza_ingredient = [
  // Mussarela
  { id: 1, pizza_id: 1, ingredient_id: 1 },
  { id: 2, pizza_id: 1, ingredient_id: 2 },
  { id: 3, pizza_id: 1, ingredient_id: 3 },
  // Presunto
  { id: 4, pizza_id: 2, ingredient_id: 1 },
  { id: 5, pizza_id: 2, ingredient_id: 2 },
  { id: 6, pizza_id: 2, ingredient_id: 4 },
  // Mussarela com oregano
  { id: 7, pizza_id: 3, ingredient_id: 1 },
  { id: 8, pizza_id: 3, ingredient_id: 2 },
  { id: 9, pizza_id: 3, ingredient_id: 3 },
  { id: 10, pizza_id: 3, ingredient_id: 5 },
  // Presunto com oregano
  { id: 11, pizza_id: 4, ingredient_id: 1 },
  { id: 12, pizza_id: 4, ingredient_id: 2 },
  { id: 13, pizza_id: 4, ingredient_id: 4 },
  { id: 14, pizza_id: 4, ingredient_id: 5 },
  // Mussarela e presunto 
  { id: 15, pizza_id: 5, ingredient_id: 1 },
  { id: 16, pizza_id: 5, ingredient_id: 2 },
  { id: 17, pizza_id: 5, ingredient_id: 3 },
  { id: 18, pizza_id: 5, ingredient_id: 4 },
  // Mussarela e presunto com oregano
  { id: 19, pizza_id: 6, ingredient_id: 1 },
  { id: 20, pizza_id: 6, ingredient_id: 2 },
  { id: 21, pizza_id: 6, ingredient_id: 3 },
  { id: 22, pizza_id: 6, ingredient_id: 4 },
  { id: 23, pizza_id: 6, ingredient_id: 5 },
]

setTimeout(insertIngredientPizza, 5000)

function insertIngredientPizza() {
  pizza_ingredient.forEach((i) => {
    knex('PIZZA_INGREDIENT').insert({
      id: i.id,
      pizza_id: i.pizza_id,
      ingredient_id: i.ingredient_id,
      amount: 1,
    }).catch((err) => { console.log(err); throw err })
  })
}

console.log('Execução encerrada')