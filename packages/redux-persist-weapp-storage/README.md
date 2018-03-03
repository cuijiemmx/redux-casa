# redux-persist-weapp-storage

A simple redux-persist storage engine for weapp (微信小程序)
Also support wepy

## install

npm i redux-persist-weapp-storage

## usage

just use redux-persist-weapp-storage as persist config storage option

```javascript
// configureStore.js
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist-weapp-storage'

const rootPersistConfig = {
  key: 'root',
  storage
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}
```