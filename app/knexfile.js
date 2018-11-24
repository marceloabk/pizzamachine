// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      user: 'postgres',
      host: 'db',
      database: 'pizza',
    },
  },
  production: {
    client: 'postgresql',
    connection: 'postgres://pjmqmuqzysggad:3e9f47a1b60e228df7c615d3fa0e424f390c7de2cc423145c811c59e4de0116e@ec2-50-17-203-51.compute-1.amazonaws.com:5432/decpi61mn42q6k',
  }
}