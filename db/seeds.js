const knex = require('./connection');


console.log('Executando seeds para inserção de usuários fake.')
knex('USER').insert([{role: 'client', name: 'FAKE1', email: 'fake1@gmail.com',  password: '123456'} ,
                    {role: 'client', name: 'FAKE2', email: 'fake2@gmail.com',  password: '123456'} ,
                    {role: 'client', name: 'FAKE3', email: 'fake3@gmail.com',  password: '123456'} ,
                    {role: 'client', name: 'FAKE4', email: 'fake4@gmail.com',  password: '123456'} ,
                    {role: 'client', name: 'FAKE5', email: 'fake5@gmail.com',  password: '123456'} ,
                    {role: 'client', name: 'FAKE6', email: 'fake6@gmail.com',  password: '123456'} ,
                    {role: 'client', name: 'FAKE7', email: 'fake7@gmail.com',  password: '123456'} ])
  .catch((err) => { console.log( err); throw err });
console.log('Execução encerrada')
