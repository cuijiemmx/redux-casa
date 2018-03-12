import { localsEnhancer, localsReducer } from '../src'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import { takeEvery, put } from 'redux-saga/effects'
import createSagaMiddleware from 'redux-saga'

const INC = 'INC'
const INC_ = 'INC_'
const DEC = 'DEC'

function* saga() {
  yield takeEvery(INC_, function*() {
    console.log('saga')
    yield put({ type: INC })
  })
}

function* saga1() {
  yield takeEvery(INC_, function*() {
    console.log('saga1')
    yield put({ type: INC })
  })
}

function* saga2() {
  yield takeEvery(INC_, function*() {
    console.log('saga2')
    yield put({ type: INC })
  })
}

function countReducer(state = 0, action) {
  switch (action.type) {
    case INC:
      return state + 1
    case DEC:
      return state - 1
    default:
      return state
  }
}

const rootReducer = combineReducers({
  count: countReducer,
  _locals: localsReducer
})

const sm = createSagaMiddleware()
const sm1 = createSagaMiddleware()
const sm2 = createSagaMiddleware()

const store = createStore(rootReducer, compose(localsEnhancer(state => state._locals), applyMiddleware(sm)))

console.log(store.local('1').created)

const local1 = store.local('1').create(countReducer, 1, applyMiddleware(sm1))
const local2 = store.local().findOrCreate(countReducer, 2, applyMiddleware(sm2))

console.log(store.local('1').created)

sm.run(saga)
sm1.run(saga1)
sm2.run(saga2)

console.log(store.getState())

const local3 = store.local('1')
console.log(local3.getState())

store.dispatch({ type: INC_ })

console.log(store.getState())

local1.dispatch({ type: INC_ })

console.log(store.getState())

local1.dispatch({ type: INC })

console.log(store.getState())

local2.dispatch({ type: DEC })

console.log(store.getState())

store.dispatch({ type: INC })

console.log(store.getState())

store.local('1').dispatch({ type: INC })
// store.local('2').dispatch({ type: DEC })

console.log(store.getState())

store.local('1').dispose()

console.log(store.getState())
