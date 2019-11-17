const streamProducer = require('../../streamProducer')
const ClientConsumer = require('../../consumer1')

module.exports = io => {
  io.on('connection', socket => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    const clientConsumer = ClientConsumer(socket)
    socket.on('addUser', data => {
      streamProducer(socket, data, clientConsumer)
    })
    socket.on('disconnect', () => {
      console.log(`Connection ${socket.id} has left the building`)
    })
  })
}
