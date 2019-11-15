const kafka = require('kafka-node')
const uuid = require('uuid')
const {io} = require('./server')

const bases = ['A', 'C', 'G', 'T', '>', '.']

const Client = (socket, topics) => {
  const userId = uuid.v4()

  const client = new kafka.KafkaClient(
    'http://localhost:2181',
    'my-client-id',
    {
      sessionTimeout: 300,
      spinDelay: 100,
      retries: 2
    }
  )

  const producer = new kafka.HighLevelProducer(client)

  producer.on('ready', function() {
    // console.log('Kafka Producer is connected and ready.')
  })

  // For this demo we just log producer errors to the console.
  producer.on('error', function(error) {
    console.error(error)
  })

  return {
    sendRecord: ({base, index}, callback = () => {}) => {
      if (!bases.includes(base)) {
        return callback(new Error(`Invalid base`))
      }

      const event = {
        id: uuid.v4(),
        timestamp: Date.now(),
        userId,
        base,
        index
      }

      const buffer = new Buffer.from(JSON.stringify(event))

      // Create a new payload

      const records = topics.map(topic => ({
        topic,
        messages: buffer,
        attributes: 1 /* Use GZip compression for the payload */
      }))

      producer.send(records, callback)
      socket.emit('sendBase', {userId, base})
      //Send record to Kafka and log result/error
    }
  }
}

module.exports = Client

// module.exports = class Client extends kafka.KafkaClient {
//   constructor(topics) {
//     super('http://localhost:2181', 'my-client-id', {
//       sessionTimeout: 300,
//       spinDelay: 100,
//       retries: 2,
//       objectMode: true
//     })
//     this.clientId = uuid.v4()
//     this.topics = topics
//     this.on('ready', function() {
//       // console.log('Kafka Producer is connected and ready.')
//     })
//     this.on('error', function(error) {
//       console.error(error)
//     })
//   }

//   addTopic(topic) {
//     this.topics.push(topic)
//   }

//   sendRecord({base, index}, cb = function(error) {console.log(error)}){
//     if (!bases.includes(base)) {
//       return cb(new Error(`Invalid base`))
//     }

//     // const event = {
//     //   id: uuid.v4(),
//     //   patientId: this.patientId,
//     //   timestamp: Date.now(),
//     //   base,
//     //   index
//     // }

//     // const buffer = new Buffer.from(JSON.stringify(event))

//     const records = this.topics.map(topic => {
//       const event = {
//         topic,
//         // messages: {
//         //   id: uuid.v4(),
//         //   patientId: this.patientId,
//         //   timestamp: Date.now(),
//         //   base,
//         //   index
//         // },
//         messages: 'hi',
//         attributes:1
//       }
//       console.log(event)
//       return event
//       // return new Buffer.from(JSON.stringify(event))

//     })
//     console.log(typeof cb)
//       //Send record to Kafka and log result/error
//       this.send(records, cb)
//     // Create a new payload
//   }
// }
