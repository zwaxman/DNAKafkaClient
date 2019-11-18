import React from 'react'
import {connect} from 'react-redux'
import user from './client/store/user'
import socket from './client/socket'

const validBases = 'ACGT'
// could include >.X+*()/\

class Consumer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      targets: {},
      hover: {},
      DNAinput: '',
      inputMessage: '',
      selectedTopics: []
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    e.persist()
    if (e.target.name === 'DNAinput') {
      const inputSequence = e.target.value.toUpperCase()
      const lastBase = inputSequence[inputSequence.length - 1] || ''
      if (validBases.includes(lastBase)) {
        this.setState({[e.target.name]: inputSequence})
      } else {
        this.setState({inputMessage: `Invalid base: ${lastBase}`})
        setTimeout(() => this.setState({inputMessage: ''}), 2000)
      }
    } else if (e.target.name === 'selectedTopics') {
      this.setState({
        [e.target.name]: [...e.target.options]
          .filter(o => o.selected)
          .map(o => o.value)
      })
    } else {
      const userId = e.target.name
      const target = e.target.value
      this.setState(prevState => ({
        ...prevState,
        targets: {...prevState.targets, [userId]: target}
      }))
    }
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

  handleSubmit(e) {
    e.preventDefault()
    const {selectedTopics} = this.state
    socket.emit('addUser', {selectedTopics, sequence: e.target.DNAinput.value})
    this.setState({DNAinput: '', selectedTopics: []})
  }

  render() {
    const {users, topics} = this.props
    const {targets, DNAinput, inputMessage, selectedTopics} = this.state
    return (
      <div>
        <div id="start-area">
          <div id="sequence-area">
            <form
              name="DNAInputForm"
              onSubmit={this.handleSubmit}
              className="form-group"
            >
              <label htmlFor="DNAinput ">Enter DNA sequence:</label>
              <input
                type="text"
                name="DNAinput"
                value={DNAinput}
                onChange={this.handleChange}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={!DNAinput.length || !selectedTopics.length}
              >
                Submit
              </button>
            </form>
            <div className="required">{inputMessage}</div>
            <div>-or-</div>
            <button
              type="button"
              name="addUser"
              onClick={() => {
                socket.emit('addUser', {selectedTopics})
                this.setState({selectedTopics: []})
              }}
              disabled={!selectedTopics.length}
            >
              Start new random DNA stream
            </button>
            {selectedTopics.length ? null : (
              <div className="required">
                Please select topic(s) before starting DNA stream
              </div>
            )}
          </div>
          <div className="form-group" id="topics-area">
            <label htmlFor="selectedTopics">Select topics:</label>
            <select multiple name="selectedTopics" onChange={this.handleChange}>
              {topics.map(topic => (
                <option key={topic} selected={selectedTopics.includes(topic)}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          {Object.keys(users).map(userId => {
            const {sequence, matches, message, topics: userTopics} = users[
              userId
            ]
            return (
              <div className="user-container" key={userId}>
                <div>Sequence ID: {userId}</div>
                <div>
                  Broadcasting to topics: <em>{userTopics.join(', ')}</em>
                </div>
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
                  <span className="message">{message}</span>
                </div>
                {matches[targets[userId]]
                  ? matches[targets[userId]].topics.map((topic, i) => (
                      <div key={i}>
                        Description: <em>{topic.description}</em> | from topics:{' '}
                        <em>{topic.topics.join(', ')}</em>
                      </div>
                    ))
                  : null}
                <div>
                  Matching indices:{' '}
                  {matches[targets[userId]]
                    ? matches[targets[userId]].indices.map((index, i) => (
                        <span
                          key={index}
                          id={`${userId}_${index}`}
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}
                        >
                          {index}
                          {i !== matches[targets[userId]].indices.length - 1
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

const mapStateToProps = ({users, topics}) => ({users, topics})

export default connect(mapStateToProps)(Consumer)
