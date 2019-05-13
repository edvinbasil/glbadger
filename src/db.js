const Redis = require('ioredis')
const db = new Redis()

async function get(key){
  return db.get(key)
}

function put(key, value) {
  db.set(key,value)
}

module.exports = {
  get,
  put
}