/**
 * Created by guozheng.li on 2017/1/22.
 */
import logs from './logs'

const store = {}

const random = () => {
  return ~~(Math.random() * 100 * 1000 * 1000)
}

const makeKey = () => {
  return `${+new Date()}-${random()}-${random()}`
}

const get = (key, isRm) => {
  let data = store[ key ]
  if (data === undefined) {
    logs.warn('Storage', `Get ${key} is undefined`)
  } else {
    logs.info('Storage', `Get ${key} is success`, data)
    if (isRm) {
      delete store[ key ]
    }
  }
  return data
}

const set = (data) => {
  let key = makeKey()
  store[ key ] = data
  logs.info('Storage', `Set ${key} is success`, data)
  return key
}

const remove = (key) => {
  // todo
}

const clear = () => {
  // todo
}

window.showStorage = () => {
  for (let k in store) {
    get(k)
  }
}

export default {
  get, set, remove, clear
}
