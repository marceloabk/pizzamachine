
exports.up = function(knex, Promise) {
  return knex.schema.createTable('PERSON', (table) => {
      table.increments();
      table.text('role');
      table.text('name');
      table.text('email').unique().notNullable();
      table.text('password');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('PERSON')
};
