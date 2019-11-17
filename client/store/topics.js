/**
 * ACTION TYPES
 */
const SET_TOPICS = 'SET_TOPICS'

/**
 * INITIAL STATE
 */
const initialState = []

/**
 * ACTION CREATORS
 */
export const setTopics = topics => ({type: SET_TOPICS, topics})

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
    case SET_TOPICS:
      return action.topics.sort()
    default:
      return state
  }
}
