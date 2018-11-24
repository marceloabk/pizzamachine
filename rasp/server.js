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

socket.emit('askOrder', '')

socket.on('getOrder', function(msg, callback){
    //msg = JSON.parse(msg)
    console.log(`Fazer pizza: ${JSON.stringify(msg)}`)
    sendPizzaToMSP(msg.order.pizza_id)
    isPizzaDone(callback, msg)
    //setTimeout(function() {
    //    callback(msg)
    //},1000)
})

socket.on('updatedDb', function() {
    socket.emit('askOrder', '')
})

 function isPizzaDone(callback, msg) {
     setTimeout(function(){
         spi.read(rxbuf, function(device, buf) {
             console.log('LEU')
             let mspResponse = buf.toString('hex')
             console.log(mspResponse)

             if (mspResponse == 'ff') {
                 console.log('Enviar resposta: pizza feita')
                 callback(msg)
             } else {	
                 isPizzaDone(callback, msg)
             }
         })
     }, 8000)
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