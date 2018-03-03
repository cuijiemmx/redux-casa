export default function() {
  let listeners = Object.create(null)
  let counter = 0

  function unsubscribeId(id) {
    return () => {
      let unsubscribe = listeners[id]
      if (unsubscribe) {
        unsubscribe()
        delete listeners[id]
      }
    }
  }

  return createStore => (...args) => {
    const store = createStore(...args)

    function subscribe(listener) {
      const unsubscribe = store.subscribe(listener)
      listeners[counter] = unsubscribe
      return unsubscribeId(counter++)
    }

    function clearListeners() {
      Object.keys(listeners).forEach(key => {
        const unsubscribe = listeners[key]
        unsubscribe()
      })
      listeners = Object.create(null)
    }

    function debug() {
      console.log(Object.keys(listeners))
    }

    return {
      ...store,
      subscribe,
      clearListeners,
      debug
    }
  }
}