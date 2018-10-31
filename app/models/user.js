const knex = require('../db/connection');
const { Client } = require('pg');
const crypto = require('crypto');

function User(role, name, email, phone, password, socialId, socialUserId){

  this.role = role;
  this.name = name;
  this.email = email;
  this.phone = phone;
  this.password = password;
  this.socialId = socialId;
  this.socialUserId = socialUserId;

};

User.prototype.setName = function (name){
    this.name = name.trim();
};

User.prototype.setEmail = function (email){
  this.email = email.trim();
};

User.prototype.setPassword = function (password){
  const hash = crypto.createHmac('sha256', process.env.HASH_SECRET)
    .update(password)
    .digest('hex');

  this.password = hash;
};

User.prototype.setSocialId = function (socialId){
  this.socialId = socialId;
};

User.prototype.setSocialUserId = function (socialUserId){
  this.socialUserId = socialUserId;
};

User.prototype.search = function (id) {
  return knex('USER').where('id', id).first();
};

User.prototype.getOneByEmail = function(email) {
  return knex('USER').where('email', email).first();
};

User.prototype.saveUser = function(){

  if(this.isValid()) {
    knex("USER").insert({
      role: this.role, 
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      social_media_id: this.socialId,
      social_media_user_id: this.socialUserId
    }).catch((err) => {
      console.log(err);
    });
  }else {
    console.log('Dados de funcionário inválidos');
  }

}

User.prototype.isValid= function() {
	return typeof this.email == 'string' &&
					this.email != '' &&
          this.checkRegistredEmail(this.email) != false &&
					typeof this.name == 'string' &&
					this.name != '';
}

User.prototype.checkRegistredEmail = function(email){
  // fetching users with the same email
  knex.select().table('USER').where('email', email)
    .then((rows) => {
      console.log(rows.length)
      if(rows.length > 0){
        return false;
      }else {
        return true;
      }
    }).catch((err) => { console.log( err); throw err });
}

module.exports = User;
