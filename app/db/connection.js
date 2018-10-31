const environment = process.env.PORT || 5000;
const config = require('../knexfile')['development'];
module.exports = require('knex')(config);
