import React from 'react'
import {connect} from 'react-redux'
import user from './client/store/user'
import socket from './client/socket'

const topics = ['AT', 'GC']

const Consumer = props => {
  const {users} = props
  console.log(socket.emit)
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          console.log('emitting addUser')
          socket.emit('addUser', topics)
        }}
      />
      <div>
        {Object.keys(props.users).map(userId => {
          const {sequence} = users[userId]
          return (
            <div key={userId}>
              {sequence.map(
                (base, i) =>
                  base.match ? (
                    <span key={i} className="match">
                      {base.base}
                    </span>
                  ) : (
                    base.base
                  )
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const mapStateToProps = ({users}) => ({users})

export default connect(mapStateToProps)(Consumer)
