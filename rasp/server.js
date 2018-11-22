const io = require('socket.io-client')
//var socket = io('https://pizza-machine-staging.herokuapp.com')
var socket = io('http://localhost:5000/')

socket.on('rasp', function(msg, callback){
    console.log('aaaa: ' + msg)
    setTimeout(function() {
        callback('deu bom aqui')
    },56000)
})
