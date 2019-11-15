import React from 'react'
import {connect} from 'react-redux'
import user from './client/store/user'
import socket from './client/socket'

const topics = ['AT', 'GC']

class Consumer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {targets: {}, hover: {}}
    this.handleChange = this.handleChange.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
  }

  handleChange(e) {
    e.persist()
    const userId = e.target.name
    const target = e.target.value
    this.setState(prevState => ({
      ...prevState,
      targets: {...prevState.targets, [userId]: target}
    }))
  }

  handleMouseEnter(e) {
    e.persist()
    const [userId, index] = e.target.id.split('_')
    this.setState({hover: {[userId]: index}})
  }

  handleMouseLeave(e) {
    e.persist()
    const userId = e.target.id.split('_')[0]
    if (this.state.hover[userId]) {
      this.setState({hover: {}})
    }
  }

  render() {
    const {users} = this.props
    const {targets} = this.state
    return (
      <div>
        <button
          type="button"
          name="addUser"
          onClick={() => {
            socket.emit('addUser', topics)
          }}
        >
          Start new DNA stream
        </button>
        <div>
          {Object.keys(users).map(userId => {
            const {sequence, matches} = users[userId]
            return (
              <div className="user-container" key={userId}>
                <div>User ID: {userId}</div>
                <div className="sequence">
                  {sequence.map((base, i) => {
                    return base.matches.includes(targets[userId]) ? (
                      <span
                        key={i}
                        className={`match ${
                          i >= +this.state.hover[userId] &&
                          i < +this.state.hover[userId] + targets[userId].length
                            ? 'hover'
                            : ''
                        }`}
                      >
                        {base.base}
                      </span>
                    ) : (
                      base.base
                    )
                  })}
                </div>
                <div className="form-group">
                  <label htmlFor={userId}>Select target sequence:</label>
                  <select name={userId} onChange={this.handleChange}>
                    <option />
                    {Object.keys(matches)
                      .sort()
                      .map(target => <option key={target}>{target}</option>)}
                  </select>
                </div>
                <div>
                  Matching indices:{' '}
                  {matches[targets[userId]]
                    ? matches[targets[userId]].map((index, i) => (
                        <span
                          key={index}
                          id={`${userId}_${index}`}
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}
                        >
                          {index}
                          {i !== matches[targets[userId]].length - 1
                            ? ', '
                            : ''}
                        </span>
                      ))
                    : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({users}) => ({users})

export default connect(mapStateToProps)(Consumer)
