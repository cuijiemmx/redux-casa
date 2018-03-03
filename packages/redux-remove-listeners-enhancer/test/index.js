import { createStore } from 'redux'
import removeListenersEnhancer from '../src'

const test = () => ({ type: 'TEST' })

function reducer(state = 1, action) {
  return state
}

const store = createStore(reducer, removeListenersEnhancer())

const u0 = store.subscribe(() => {
  console.log('u0')
  store.debug()
})

const u1 = store.subscribe(() => {
  console.log('u1')
  store.debug()
})

const u2 = store.subscribe(() => {
  console.log('u2')
  store.debug()
})

store.dispatch(test())

u0()

store.dispatch(test())

console.log('cleared')

store.clearListeners()
u2() // shouldn't failed after listeners cleared

store.dispatch(test())

const u4 = store.subscribe(() => {
  console.log('u4')
  store.debug()
})

store.dispatch(test())

const u5 = store.subscribe(() => {
  console.log('u5')
  store.debug()
})

store.dispatch(test())