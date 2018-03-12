export default function(key) {
  return action => {
    return { _local: key, ...action }
  }
}
