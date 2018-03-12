import localAction from './localAction'
import types from './types'
import uuid from 'uuid/v4'

export default function(localsStateMapper) {
  return createStore => (reducer, ...args) => {
    const store = createStore(reducer, ...args)

    const locals = Object.create(null)

    function local(key = uuid()) {
      function create(localReducer, localPreloadedState, localEnhancer) {
        if (typeof localPreloadedState === 'function' && typeof localEnhancer === 'undefined') {
          localEnhancer = localPreloadedState
          localPreloadedState = undefined
        }

        if (typeof localEnhancer !== 'undefined') {
          if (typeof localEnhancer !== 'function') {
            throw new Error('Expected the local enhancer to be a function.')
          }

          return localEnhancer(create)(localReducer, localPreloadedState)
        }

        if (typeof localReducer !== 'function') {
          throw new Error('Expected the local reducer to be a function.')
        }

        createLocal()

        function createLocal() {
          store.dispatch({
            type: types.CREATE_LOCAL,
            payload: {
              key,
              reducer: localReducer,
              initialState: localPreloadedState
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
          store.dispatch({
            type: types.DISPOSE_LOCAL,
            payload: {
              key
            }
          })
        }

        function subscribe(listener) {
          ensureLocal()
          return store.subscribe(listener)
        }

        locals[key] = {
          ...store,
          dispatch,
          getState,
          replaceReducer,
          subscribe,
          dispose
        }

        return locals[key]
      }

      function findOrCreate(...args) {
        if (key in locals) {
          return locals[key]
        } else {
          return {
            ...create(...args),
            created: true,
            findOrCreate
          }
        }
      }

      if (key in locals) {
        return {
          ...locals[key],
          created: true,
          findOrCreate
        }
      } else {
        return {
          create,
          created: false,
          findOrCreate
        }
      }
    }

    return {
      ...store,
      local
    }
  }
}
