const knex = require('./connection');

console.log('Executando seeds para inserção de usuários fake.')

console.log('Inserindo clientes')
knex('USER').max('id').first()
.then((user) => {
  if(user.max == null){user.max=1}
  for(var aux=user.max; aux<=user.max+10; aux++){
    knex('USER').insert({role: 'client', name: 'Cliente_FAKE_'+aux , email: 'c_fake'+aux+'@gmail.com', phone:'332211', password: '123456'})
    .catch((err) => { console.log( err); throw err });
  }

}).catch((err) => { console.log( err); throw err });


knex('USER').max('id').first()
.then((user) => {
  if(user.max == null){user.max=1}
  for(var aux=user.max; aux<=user.max+5; aux++){
    knex('USER').insert({role: 'employee', name: 'Funcionário_FAKE_'+aux , email: 'e_fake'+aux+'@gmail.com', phone:'332211', password: '123456'})
    .catch((err) => { console.log( err); throw err });
  }

}).catch((err) => { console.log( err); throw err });

const ingredients = [
  { name: 'Massa', price: 1.00},
  { name: 'Molho', price: 0.25},
  { name: 'Mussarela', price: 0.50},
  { name: 'Calabresa', price: 0.50},
  { name: 'Presunto', price: 0.50},
  { name: 'Frango', price: 0.50},
  { name: 'Tomate', price: 0.25},
  { name: 'Pimentão', price: 0.25},
  { name: 'Catupiry', price: 0.25},
  { name: 'Milho', price: 0.25},
  { name: 'Oregano', price: 0.25},
  { name: 'Bakon', price: 0.50},
  { name: 'Provolone', price: 0.50},
  { name: 'Parmesão', price: 0.50},
  { name: 'Manjericão', price: 0.25},
  { name: 'Ovo', price: 0.50},
  { name: 'Palmito', price: 0.25},
  { name: 'Azeitona', price: 0.25},
  { name: 'Cebola', price: 0.25},
  { name: 'Peperoni', price: 0.50},
  { name: 'Atum', price: 0.50},
  { name: 'Bacalheu', price: 0.50},
  { name: 'Carne de sol', price: 0.50},
];

console.log('Inserindo ingredientes...');

ingredients.forEach(i => {
  knex('INGREDIENT').select()
  .where('name', i.name)
  .then(rows => {
    if (rows.length === 0) {
      knex('INGREDIENT').insert({
        'name': i.name,
        'price': i.price
      }).catch((err) => { console.log( err); throw err });
    } else {
      console.log(`${i.name} já existe no banco.`)
    }
  })
  .catch((err) => { console.log( err); throw err });
});

console.log('Ingredientes inseridos.');

const pizzas = [
  { name: 'Frango com catupiry' },
  { name: 'Calabresa' },
  { name: '4 Queijos' },
  { name: 'Portuguesa' },
  { name: 'Bakon' },
  { name: 'Atum' },
  { name: 'Palmito' },
  { name: 'Marguerita' },
];

pizzas.forEach(i => {
  knex('PIZZA').select()
  .where('name', i.name)
  .then(rows => {
    if (rows.length === 0) {
      knex('PIZZA').insert({
        'name': i.name
      }).catch((err) => { console.log( err); throw err });
    } else {
      console.log(`${i.name} já existe no banco.`)
    }
  })
  .catch((err) => { console.log( err); throw err });
});

const pizza_ingredient = [
  // Frango com catupiry
  { pizza_id: 1, ingredient_id: 1 },
  { pizza_id: 1, ingredient_id: 2 },
  { pizza_id: 1, ingredient_id: 3 },
  { pizza_id: 1, ingredient_id: 6 },
  // Calabresa
  { pizza_id: 2, ingredient_id: 1 },
  { pizza_id: 2, ingredient_id: 2 },
  { pizza_id: 2, ingredient_id: 4 },
  { pizza_id: 2, ingredient_id: 11 },
  // 4 Queijos
  { pizza_id: 3, ingredient_id: 1 },
  { pizza_id: 3, ingredient_id: 2 },
  { pizza_id: 3, ingredient_id: 3 },
  { pizza_id: 3, ingredient_id: 9 },
  { pizza_id: 3, ingredient_id: 13 },
  { pizza_id: 3, ingredient_id: 14 },
  // Portuguesa
  { pizza_id: 4, ingredient_id: 1 },
  { pizza_id: 4, ingredient_id: 2 },
  { pizza_id: 4, ingredient_id: 3 },
  { pizza_id: 4, ingredient_id: 12 },
  { pizza_id: 4, ingredient_id: 7 },
  { pizza_id: 4, ingredient_id: 16 },
  { pizza_id: 4, ingredient_id: 19 },
  { pizza_id: 4, ingredient_id: 4 },
  { pizza_id: 4, ingredient_id: 18 },
  { pizza_id: 4, ingredient_id: 8 },
  { pizza_id: 4, ingredient_id: 11 },
  // Bakon
  { pizza_id: 5, ingredient_id: 1 },
  { pizza_id: 5, ingredient_id: 2 },
  { pizza_id: 5, ingredient_id: 3 },
  { pizza_id: 5, ingredient_id: 12 },
  { pizza_id: 5, ingredient_id: 7 },
  { pizza_id: 5, ingredient_id: 11 },
  // Atum
  { pizza_id: 6, ingredient_id: 1 },
  { pizza_id: 6, ingredient_id: 2 },
  { pizza_id: 6, ingredient_id: 3 },
  { pizza_id: 6, ingredient_id: 19 },
  { pizza_id: 6, ingredient_id: 21 },
  { pizza_id: 6, ingredient_id: 18 },
  { pizza_id: 6, ingredient_id: 11 },
  // Palmito
  { pizza_id: 7, ingredient_id: 1 },
  { pizza_id: 7, ingredient_id: 2 },
  { pizza_id: 7, ingredient_id: 3 },
  { pizza_id: 7, ingredient_id: 17 },
  { pizza_id: 7, ingredient_id: 11 },
  // Marguerita
  { pizza_id: 8, ingredient_id: 1 },
  { pizza_id: 8, ingredient_id: 2 },
  { pizza_id: 8, ingredient_id: 3 },
  { pizza_id: 8, ingredient_id: 7 },
  { pizza_id: 8, ingredient_id: 15 },
  { pizza_id: 8, ingredient_id: 11 },
];

setTimeout(insertIngredientPizza, 5000);

function insertIngredientPizza() {
  pizza_ingredient.forEach(i => {

    knex('PIZZA_INGREDIENT').insert({
      'pizza_id': i.pizza_id, 
      'ingredient_id': i.ingredient_id,
      'amount': 1
    }).catch((err) => { console.log( err); throw err });
  
  });
}

console.log('Execução encerrada')
