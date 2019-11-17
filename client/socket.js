import io from 'socket.io-client'
import {
  addBase,
  addMatch,
  updateMessage,
  clearMessage,
  registerUser
} from './store/users'
import {setTopics} from './store/topics'
import store from './store'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('registerUser', data => {
  store.dispatch(registerUser(data))
})

socket.on('sendBase', data => {
  store.dispatch(addBase(data))
})

socket.on('sendMatch', match => {
  store.dispatch(addMatch(match))
  store.dispatch(updateMessage(match))
  setTimeout(() => store.dispatch(clearMessage(match.userId)), 1000)
})

socket.on('sendTopics', topics => {
  store.dispatch(setTopics(topics))
})

export default socket
