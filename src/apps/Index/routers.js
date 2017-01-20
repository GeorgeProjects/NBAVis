/**
 * Created by huangxinxin on 2017/1/16.
 */
const table = [ {
  uri: '/demo',
  path: [ '/demo' ],
  name: 'PageDemo',
  text: 'Demo',
  component (cb) {
    require([ 'APPS/Index/PageDemo/index' ], cb)
  }
},
  {
    uri: '/helloworld',
    path: [ '/helloworld' ],
    name: 'HelloWorld',
    text: 'HelloWorld',
    component (cb) {
      require([ 'APPS/Index/PageDemo/index' ], cb)
    }
  }
]

export default {
  table,
  get components () {
    let dict = {}
    table.forEach((item) => {
      dict[ item.name ] = item.component
    })
    return dict
  },
  get map () {
    let dict = {}
    table.forEach((item) => {
      dict[ item.name ] = item
    })
    return dict
  },
  route (uri) {
    console.log('route=>', uri)
    const match = (str) => {
      if (str instanceof RegExp) {
        return str.test(uri)
      }
      console.log('matchResult=>', str)
      return str === uri
    }
    let item = table.find((d) => {
      console.log('d.path=>', d.path)
      if (d.path instanceof Array) {
        return d.path.some(match)
      } else {
        return match(d.path)
      }
    })
    return item
  }
}
