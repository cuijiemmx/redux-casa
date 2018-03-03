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
    let { key, reducer, initialState } = action.payload
    return {
      [key]: { reducer, state: reducer(initialState, action) },
      ...localsState
    }
  } else {
    let nextLocalsState = {}
    const keys = Object.keys(localsState)
    keys.forEach(key => {
      let { reducer, state } = localsState[key]
      nextLocalsState[key] = { reducer, state: localReducerEnhancer(key, reducer)(state, action) }
    })
    return nextLocalsState
  }
}