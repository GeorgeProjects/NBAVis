import style from './style.less'
import template from './template.html'
import {teamIndexChange} from '../../../vuex/actions'
import {getTimeWindow} from '../../../vuex/getters'

export default{
  template,
  vuex: {
    actions: {
      teamIndexChange
    },
    getters: {
      getTimeWindow
    }
  },
  data () {
    return {
      style
    }
  },
  methods: {
    changeTeamIndex () {
      console.log('Action-StoryLineView-changeTeamIndex', 3)
      this.teamIndexChange(3)
    }
  },
  watch: {
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-StoryLineView-TimeWindow=>', this.getTimeWindow)
    }
  },
  created () {
    this.teamIndexChange(2)
  }
}
