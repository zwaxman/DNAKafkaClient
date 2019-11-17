/* eslint-disable complexity */
/**
 * ACTION TYPES
 */
const ADD_BASE = 'ADD_BASE'
const ADD_MATCH = 'ADD_MATCH'
const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
const CLEAR_MESSAGE = 'CLEAR_MESSAGE'
const REGISTER_USER = 'REGISTER_USER'

/**
 * INITIAL STATE
 */
const initialState = {}

/**
 * ACTION CREATORS
 */
export const addBase = data => ({type: ADD_BASE, data})
export const addMatch = data => ({type: ADD_MATCH, data})
export const updateMessage = data => ({type: UPDATE_MESSAGE, data})
export const clearMessage = userId => ({type: CLEAR_MESSAGE, userId})
export const registerUser = data => ({type: REGISTER_USER, data})

/**
 * THUNK CREATORS
 */
// export const receivedBase = base => dispatch => {
//   try {
//       console.log(base)
//     dispatch(addBase(base))
//   } catch (err) {
//     console.error(err)
//   }
// }

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_USER: {
      const {userId, topics} = action.data
      return {
        ...state,
        [userId]: {topics, message: '', matches: {}, sequence: []}
      }
    }
    case ADD_BASE: {
      const {userId, base} = action.data
      if (!state[userId]) {
        return {
          ...state,
          [userId]: {message: '', matches: {}, sequence: [{base, matches: []}]}
        }
      } else {
        return {
          ...state,
          [userId]: {
            ...state[userId],
            sequence: [...state[userId].sequence, {base, matches: []}]
          }
        }
      }
    }
    case ADD_MATCH: {
      const {userId, index, target} = action.data
      const newSequence = [...state[userId].sequence]
      for (let i = index; i < index + target.length; i++) {
        newSequence[i].matches.push(target)
      }
      return {
        ...state,
        [userId]: {
          ...state[userId],
          sequence: newSequence,
          matches: {
            ...state[userId].matches,
            [target]: state[userId].matches[target]
              ? [...state[userId].matches[target], index].sort(
                  (A, B) => (A > B ? 1 : -1)
                )
              : [index]
          }
        }
      }
    }
    case UPDATE_MESSAGE: {
      const {userId, target} = action.data
      return {
        ...state,
        [userId]: {...state[userId], message: `New match - target: ${target}`}
      }
    }
    case CLEAR_MESSAGE: {
      return {...state, [action.userId]: {...state[action.userId], message: ''}}
    }
    default:
      return state
  }
}
