const knex = require('./connection');

console.log('Executando seeds para inserção de usuários fake.')

console.log('Inserindo clientes')
knex('USER').max('id').where("role", 'client').first()
.then((user) => {
  if(user.max == null){user.max=1}
  for(var aux=user.max; aux<=user.max+10; aux++){
    knex('USER').insert({role: 'client', name: 'Cliente_FAKE_'+aux , email: 'c_fake'+aux+'@gmail.com', phone:'332211', password: '123456'})
    .catch((err) => { console.log( err); throw err });
  }

}).catch((err) => { console.log( err); throw err });


knex('USER').max('id').where("role", 'employee').first()
.then((user) => {
  if(user.max == null){user.max=1}
  for(var aux=user.max; aux<=user.max+5; aux++){
    knex('USER').insert({role: 'employee', name: 'Funcionário_FAKE_'+aux , email: 'e_fake'+aux+'@gmail.com', phone:'332211', password: '123456'})
    .catch((err) => { console.log( err); throw err });
  }

}).catch((err) => { console.log( err); throw err });
console.log('Execução encerrada')
