
exports.up = function(knex, Promise) {
  return knex.schema
  .createTable('INGREDIENT', (table) => {
    table.increments('id').primary();
    table.text('name');
    table.integer('price');
  })
  .createTable('PIZZA', (table) => {
    table.increments('id').primary();
    table.text('name');
  })
  .createTable('PIZZA_INGREDIENT', (table) => {
    table.increments('id').primary();
    table.integer('amount');
    table.integer('pizza_id');
    table.integer('ingredient_id');
    table.foreign('ingredient_id').references('INGREDIENT.id');
    table.foreign('pizza_id').references('PIZZA.id');
  })
  .createTable('ORDER', (table) => {
    table.increments('id').primary();
    table.integer('user_id');
    table.foreign('user_id').references('USER.id');
  })
  .createTable('ORDER_PIZZA', (table) => {
    table.increments('id').primary();
    table.integer('amount');
    table.integer('pizza_id');
    table.integer('order_id');
    table.foreign('pizza_id').references('PIZZA.id');
    table.foreign('order_id').references('ORDER.id');
  })
  .createTable('QUEUE', (table) => {
    table.increments('id').primary();
    table.integer('order_id');
    table.foreign('order_id').references('ORDER.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTableIfExists('USER')
    .dropTableIfExists('SOCIAL_MEDIA')
    .dropTableIfExists('SOCIQUEUEAL_MEDIA')
    .dropTableIfExists('ORDER_PIZZA')
    .dropTableIfExists('ORDER')
    .dropTableIfExists('PIZZA_INGREDIENT')
    .dropTableIfExists('QUEUE')
    .dropTableIfExists('PIZZA')
    .dropTableIfExists('INGREDIENT')
};
