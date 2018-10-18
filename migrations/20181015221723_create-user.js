
exports.up = function(knex, Promise) {
  return knex.schema.createTable('PERSON', (table) => {
      table.increments();
      table.text('role');
      table.text('name');
      table.text('email').unique().notNullable();
      table.text('password');
      table.text('social_media_id')
      table.text('social_media_code')
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('PERSON')
};
