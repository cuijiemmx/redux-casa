import localAction from './localAction'
import types from './types'

export default function(localsStateMapper) {
  return createStore => (reducer, ...args) => {
    const store = createStore(reducer, ...args)

    function local(key, localReducer, localInitialState, localEnhancer) {

      const state = store.getState()

      if (!(key in localsStateMapper(state))) {
        if (typeof localInitialState === 'function' && typeof localEnhancer === 'undefined') {
          localEnhancer = localInitialState
          localInitialState = undefined
        }

        if (typeof localEnhancer !== 'undefined') {
          if (typeof localEnhancer !== 'function') {
            throw new Error('Expected the local enhancer to be a function.')
          }

          return localEnhancer(local)(key, localReducer, localInitialState)
        }

        if (typeof localReducer !== 'function') {
          throw new Error('Expected the local reducer to be a function.')
        }

        createLocal()
      }

      function createLocal() {
        store.dispatch({
          type: types.CREATE_LOCAL,
          payload: {
            key,
            reducer: localReducer,
            initialState: localInitialState
          }
        })
      }

      function ensureLocal() {
        const state = store.getState()
        if (!(key in localsStateMapper(state))) {
          createLocal()
        }
      }

      function getState() {
        ensureLocal()
        const state = store.getState()
        return localsStateMapper(state)[key].state
      }

      function dispatch(action) {
        ensureLocal()
        return store.dispatch(localAction(key)(action))
      }

      function replaceReducer(nextReducer) {
        ensureLocal()
        const state = store.getState()
        localsStateMapper(state)[key].reducer = nextReducer
      }

      function dispose() {
        ensureLocal()
        const state = store.getState()
        delete localsStateMapper(state)[key]
      }

      function subscribe(listener) {
        ensureLocal()
        return store.subscribe(listener)
      }

      return {
        ...store,
        dispatch,
        getState,
        replaceReducer,
        subscribe,
        dispose
      }
    }

    return {
      ...store,
      local
    }
  }
}