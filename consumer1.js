const kafka = require('kafka-node')

const topics = []
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
  encoding: 'buffer'
}

const ClientConsumer = socket => {
  let client = new kafka.KafkaClient('http://localhost:2181')
  const consumer = new kafka.Consumer(client, topics, options)
  console.log('Creating consumer listening to topic:', process.env.TOPIC)

  client = new kafka.KafkaClient('http://localhost:2181')
  const admin = new kafka.Admin(client)
  // eslint-disable-next-line handle-callback-err
  admin.listTopics((err, topicsList) => {
    const filteredTopics = Object.keys(topicsList[1].metadata).filter(
      topic => !topic.startsWith('match') && topic !== '__consumer_offsets'
    )
    socket.emit('sendTopics', filteredTopics)
    console.log('sending topics', filteredTopics)
  })

  consumer.on('message', function(message) {
    console.log('message')
    // // Read string into a buffer.
    var buf = new Buffer(message.value, 'binary')
    var decodedMessage = JSON.parse(buf.toString())
    socket.emit('sendMatch', decodedMessage)
    console.log('received match', decodedMessage)
  })

  consumer.on('error', function(err) {
    console.log('error', err)
  })

  consumer.addUser = function(userId) {
    const newTopic = `match_${userId}`
    admin.createTopics([newTopic], (err, res) => {
      err ? console.log(err) : console.log(res)
      consumer.addTopics([newTopic])
    })
  }

  process.on('SIGINT', function() {
    consumer.close(true, function() {
      process.exit()
    })
  })

  return consumer
}

module.exports = ClientConsumer
