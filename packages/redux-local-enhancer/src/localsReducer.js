import types from './types'

function localReducerEnhancer(key, reducer) {
  return (state, action) => {
    if (action._local && (action._local !== key)) {
      return state
    } else {
      return reducer(state, action)
    }
  }
}

export default function(localsState = {}, action) {
  if (action.type === types.CREATE_LOCAL) {
    const { key, reducer, initialState } = action.payload
    return {
      [key]: { reducer, state: reducer(initialState, action) },
      ...localsState
    }
  } else if (action.type === types.DISPOSE_LOCAL) {
    const key = action.payload.key
    const {
      [key]: _, ...nextLocalsState
    } = localsState
    return nextLocalsState
  } else {
    const nextLocalsState = {}
    const keys = Object.keys(localsState)
    keys.forEach(key => {
      const { reducer, state } = localsState[key]
      nextLocalsState[key] = { reducer, state: localReducerEnhancer(key, reducer)(state, action) }
    })
    return nextLocalsState
  }
}
