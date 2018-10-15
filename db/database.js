const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'db'
})

const PORT = process.env.PORT || 5000;

(async function(){
  await client.connect()

  try{
    const res = await client.query(
      'CREATE TABLE PERSON(id SERIAL PRIMARY KEY, role VARCHAR(40) not null, name VARCHAR(40) not null, email VARCHAR(40) not null UNIQUE, password VARCHAR(40) not null)'
    );
  } catch(err) {
    console.log('Não foi possível criar tabela')
  }
  await client.end()

})();
