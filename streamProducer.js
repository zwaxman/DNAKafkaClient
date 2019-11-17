const Client = require('./producer')
const bases = 'ACGT'

module.exports = (socket, data, clientConsumer) => {
  const {selectedTopics, sequence} = data
  const client = Client(socket, selectedTopics)
  let index = 0
  console.log(client.userId)
  clientConsumer.addUser(client.userId)
  socket.emit('registerUser', {userId: client.userId, topics: selectedTopics})
  client.sendRecord({base: '>', index})

  const end = setInterval(() => {
    const base = sequence
      ? sequence[index]
      : bases[Math.floor(Math.random() * bases.length)]
    client.sendRecord({base, index})
    index++
  }, 100)

  setTimeout(() => {
    clearInterval(end)
    client.sendRecord({base: '.', index})
    // Producer.sendRecord({type, userId, base: '.', index})
  }, 25000)
}

// const users = [
//   {userId: '1', topics: ['A', 'TC']},
//   {userId: '2', topics: ['A', 'GG']}
// ]

// users.map(user => {

//   user.topics.map(topic => {
//     Producer.sendRecord({userId: user.userId, base: '>', index, topic})
//   })

//   const end = setInterval(() => {
//     const base = bases[Math.floor(Math.random() * bases.length)]
//     user.topics.map(topic => {
//       const record = {userId: user.userId, base, index, topic}
//       Producer.sendRecord(record)
//       console.log('sent record:', record)
//     })
//     index++
//   }, 50)

//   setTimeout(() => {
//     clearInterval(end)
//     user.topics.map(topic => {
//       Producer.sendRecord({userId: user.userId, base: '.', index, topic})
//     })
//     // Producer.sendRecord({type, userId, base: '.', index})
//   }, 5000)
// })

// const client = new Client(['AT'])

// const bases = ['A', 'C', 'G', 'T']

// let index = 0
// const start = {base: '>', index}
// client.sendRecord(start)
// const end = setInterval(() => {
//   const base = bases[Math.floor(Math.random() * bases.length)]
//     client.sendRecord({base, index})
//     console.log('sent record:', {base, index})
//   index++
// }, 1000)

// setTimeout(()=>{
//   clearInterval(end)
//     client.sendRecord({base: '.', index})
//   // Producer.sendRecord({type, userId, base: '.', index})
// }, 10000)

// const type = 'DNA'

// Producer.sendRecord({type, userId, base: '>', index})
