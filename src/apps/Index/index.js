/**
 * Created by huangxinxin on 2017/1/16.
 * 单页index与其他的index进行的就是增加了routers, 动态的切换界面
 */
import style from './style.less'
import template from './template.html'
import AppHeader from '../../components/Header'
// import AppMain from './Main'
import StoryLine from './StoryLine'
import PlayerChangements from './PlayerChangements'
import TimeLine from './TimeLine'
import TeamInfo from './TeamInfo'
import PlayerInfo from './PlayerInfo'
// import routers from './routers'
import {activeRouter} from '../../vuex/getters'

export default {
  template,
  vuex: {
    getters: {
      activeRouter
    }
  },
  data () {
    return {
      style
    }
  },
  components: {
    AppHeader, StoryLine, PlayerChangements, TimeLine, TeamInfo, PlayerInfo
  }
}
