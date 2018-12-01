const io = require('socket.io-client')
const SPI = require('spi')
var socket = io('https://pizza-machine-staging.herokuapp.com')
//var socket = io('http://localhost:5000/')


var spi = new SPI.Spi('/dev/spidev0.0', {
     'mode': SPI.MODE['MODE_0'],  // always set mode as the first option
     'chipSelect': SPI.CS['none'] // 'none', 'high' - defaults to low
}, function(s){s.open();});
 
var txbuf = new Buffer([0x55])
var rxbuf = new Buffer([0x00])

waitInternet(function () {
    socket.emit('askOrder', '')
})

let emptyBuffer = process.env.CLEAN
socket.on('getOrder', function(msg, callback){
    console.log(`Fazer pizza: ${JSON.stringify(msg)}`)
    if (emptyBuffer) {
        clean(msg, callback)
    } else {
        order(msg, callback)
    }
})

socket.on('updatedDb', function() {
    console.log('dp updated')
    waitInternet(function () {
        socket.emit('askOrder', '')
    })
})

 function isPizzaDone(callback, msg, pizzaNumber) {
     setTimeout(function(){
         txbuf = new Buffer([pizzaNumber])
         spi.transfer(txbuf, rxbuf, function(device, buf) {
             console.log('LEU')
             let mspResponse = buf.toString('hex')
             console.log(mspResponse)

             if (mspResponse == 'ff') {
                 console.log('Enviar resposta: pizza feita')
		    txbuf = new Buffer(['20'])
		    spi.write(txbuf, function(device, buf) {
		        console.log('ESCREVEU')
		        console.log(buf.toString('hex'))
   		    })
                 callback(msg)
             } else {	
                 isPizzaDone(callback, msg, pizzaNumber)
             }
         })
}, 10000)
 }

function sendPizzaToMSP(pizzaNumber){
    pizzaNumber = `0x0` + pizzaNumber
    console.log(pizzaNumber)
    txbuf = new Buffer([pizzaNumber])
    spi.write(txbuf, function(device, buf) {
        console.log('ESCREVEU')
        console.log(buf.toString('hex'))
    })    
}

function order(msg, callback) {
    let pizza = msg.order.pizza_id
    sendPizzaToMSP(pizza)
    isPizzaDone(callback, msg, pizza)
}

function clean(msg, callback) {
    setTimeout(function() {
        callback(msg)
    },1000)
}

function waitInternet(callback) {
    console.log('Conectado: '+socket.connected)
    if (socket.connected) {
        callback()
    } else {
        setTimeout(function() {
            waitInternet(callback)
        }, 2000)
    }
}