const knex = require('../db/connection');
const { Client } = require('pg');

function Person(role){

  this.role = role;
  this.name = '';
  this.email = '';

};

Person.prototype.setName = function (name){
    this.name = name.trim();
};

Person.prototype.setEmail = function (email){
  this.email = email.trim();
};

Person.prototype.setPassword = function (password){
    this.password = password;
};

Person.prototype.search = function (id) {
  return knex('PERSON').where('id', id).first();
};

Person.prototype.getOneByEmail = function(email) {
  return knex('PERSON').where('email', email).first();
};

Person.prototype.saveUser = function(newUser){

  const client = new Client({
    user: 'postgres',
    host: 'db',
    database: 'pizza'
  });

  (async function(){
    await client.connect()
    const res = await client.query("INSERT INTO \"PERSON\"(role, name, email, password) VALUES ($1, $2, $3, $4)",
                [newUser.role, newUser.name, newUser.email, newUser.password]);
    await client.end()
    console.log('Usuário salvo com sucesso');
  })().catch(e => console.error(e.stack));


}

Person.prototype.isValid= function() {
	return typeof this.email == 'string' &&
					this.email != '' &&
          this.checkRegistredEmail(this.email) != false &&
					typeof this.name == 'string' &&
					this.name != '' &&
					typeof this.password == 'string' &&
					this.password != '' &&
					this.password.length >= 5 &&
					this.password == this.password;
}

Person.prototype.checkRegistredEmail = function(email){
  // fetching users with the same email
  knex.select().table('person').where('email', email)
    .then((rows) => {
      console.log(rows.length)
      if(rows.length > 0){
        return false;
      }else {
        return true;
      }
    }).catch((err) => { console.log( err); throw err });
}

module.exports = Person;
