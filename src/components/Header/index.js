/**
 * Created by huangxinxin on 2017/1/16.
 */
import style from './style.less'
import template from './template.html'

export default {
  template,
  props: {
    navs: {
      type: Array,
      default () {
        return []
      }
    },
    active: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      style
    }
  }
}
