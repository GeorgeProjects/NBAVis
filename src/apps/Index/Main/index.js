/**
 * Created by huangxinxin on 2017/1/16.
 */
import style from './style.less'
import template from './template.html'
import page from 'page'
import routers from '../routers'
import {urlChange} from '../../../vuex/actions'

console.log(routers.components)
export default {
  template,
  vuex: {
    actions: {
      urlChange
    }
  },
  data () {
    return {
      style,
      activeMain: ''
    }
  },
  components: routers.components,
  methods: {
    pageGo (ctx) {
      let uri = ctx.path
      console.log('ctx=>', ctx)
      console.log('ctx.path=>', ctx.path)
      let item = routers.route(uri)
      if (item) {
        this.activeMain = item.name
      }
      console.log('item=>', item)
      this.urlChange(ctx, item)
    }
  },
  created () {
    page.base('/page')
    console.log('this=>', this)
    page('/:any', this.pageGo.bind(this))
    page.start()
  }
}
