const types = {
  INIT: '@@locals/INIT' +
    Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.'),
  REPLACE: '@@locals/REPLACE' +
    Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.'),
  CREATE_LOCAL: '@@locals/CREATE'
}

export default types