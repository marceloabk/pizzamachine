
exports.up = function (knex) {
  return knex.schema
    .createTable('SOCIAL_MEDIA', (table) => {
      table.increments('id').primary()
      table.text('media')
    })
    .alterTable('USER', (table) => {
      table.renameColumn('social_media_code', 'social_media_user_id')
      table.foreign('social_media_id').references('SOCIAL_MEDIA.id')
    })
}

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('USER')
    .dropTableIfExists('SOCIAL_MEDIA')
}
