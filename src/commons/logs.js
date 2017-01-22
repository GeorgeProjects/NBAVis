/**
 * Created by guozheng.li on 2017/1/22.
 */
import config from './config'

const debug = config.debug

const fMap = {
  log: console.log,
  info: console.info,
  warn: console.warn,
  error: console.error
}

const print = (type) => {
  const func = fMap[ type ]
  return (...args) => {
    if (func && debug) {
      if (args.length > 1) {
        console.group(args[ 0 ])
        let n = args.shift()
        fMap[ type ](`[${n}]=>`, ...args)
        console.groupEnd()
      } else {
        fMap[ type ](...args)
      }
    }
  }
}

export default {
  log: print('log'),
  info: print('info'),
  warn: print('warn'),
  error: print('error')
}
