import style from './style.less'
import template from './template.html'
import {getTeamIndex, getHoverPlayer} from '../../../vuex/getters'
import {timeWindowChange, hoverPlayerChange} from '../../../vuex/actions'
import TimeAxis from '../../../components/TimeAxis'
import $ from 'jquery'

export default{
  template,
  vuex: {
    actions: {
      timeWindowChange,
      hoverPlayerChange
    },
    getters: {
      getTeamIndex,
      getHoverPlayer
    }
  },
  data () {
    return {
      style,
      divWidth: 0,
      divHeight: 0,
      myData: {
        '1986': {
          'matches': [
            '凯尔特3-0公牛'
          ],
          'loc': 'east',
          'best': 8
        },
        '1987': {
          'matches': [
            '公牛3-2骑士',
            '活塞4-1公牛'
          ],
          'loc': 'east',
          'best': 4
        },
        '1985': {
          'matches': [
            '凯尔特3-0公牛'
          ],
          'loc': 'east',
          'best': 8
        },
        '1988': {
          'matches': [
            '骑士2-3公牛',
            '公牛4-2尼克斯',
            '活塞4-2公牛'
          ],
          'loc': 'east',
          'best': 2
        },
        '1989': {
          'matches': [
            '公牛3-1雄鹿',
            '公牛4-176人',
            '活塞4-3公牛'
          ],
          'loc': 'east',
          'best': 2
        },
        '2014': {
          'matches': [
            '公牛4-2雄鹿',
            '骑士4-2公牛'
          ],
          'loc': 'east',
          'best': 4
        },
        '2011': {
          'matches': [
            '公牛2-476人'
          ],
          'loc': 'east',
          'best': 8
        },
        '2010': {
          'matches': [
            '公牛4-1步行者',
            '公牛4-2老鹰',
            '公牛1-4热火'
          ],
          'loc': 'east',
          'best': 2
        },
        '2013': {
          'matches': [
            '公牛1-4奇才'
          ],
          'loc': 'east',
          'best': 8
        },
        '2012': {
          'matches': [
            '篮网3-4公牛',
            '热火4-1公牛'
          ],
          'loc': 'east',
          'best': 4
        },
        '1991': {
          'matches': [
            '公牛3-0热火',
            '公牛4-3尼克斯',
            '公牛4-2骑士',
            '公牛4-2开拓者'
          ],
          'loc': 'east',
          'best': 0
        },
        '1990': {
          'matches': [
            '公牛3-0尼克斯',
            '公牛4-176人',
            '公牛4-0活塞',
            '公牛4-1湖人'
          ],
          'loc': 'east',
          'best': 0
        },
        '1993': {
          'matches': [
            '公牛3-0骑士',
            '尼克斯4-3公牛'
          ],
          'loc': 'east',
          'best': 4
        },
        '1992': {
          'matches': [
            '公牛3-0老鹰',
            '公牛4-0骑士',
            '尼克斯2-4公牛',
            '公牛4-2太阳'
          ],
          'loc': 'east',
          'best': 0
        },
        '1995': {
          'matches': [
            '公牛3-0热火',
            '公牛4-1尼克斯',
            '公牛4-0魔术',
            '公牛4-2超音速'
          ],
          'loc': 'east',
          'best': 0
        },
        '1994': {
          'matches': [
            '黄蜂1-3公牛',
            '魔术4-2公牛'
          ],
          'loc': 'east',
          'best': 4
        },
        '1997': {
          'matches': [
            '公牛3-0篮网',
            '公牛4-1黄蜂',
            '公牛4-3步行者',
            '公牛4-2爵士'
          ],
          'loc': 'east',
          'best': 0
        },
        '1996': {
          'matches': [
            '公牛3-0子弹',
            '公牛4-1老鹰',
            '公牛4-1热火',
            '公牛4-2爵士'
          ],
          'loc': 'east',
          'best': 0
        },
        '2006': {
          'matches': [
            '公牛4-0热火',
            '活塞4-2公牛'
          ],
          'loc': 'east',
          'best': 4
        },
        '2004': {
          'matches': [
            '公牛2-4奇才'
          ],
          'loc': 'east',
          'best': 8
        },
        '2005': {
          'matches': [
            '热火4-2公牛'
          ],
          'loc': 'east',
          'best': 8
        },
        '2008': {
          'matches': [
            '凯尔特4-3公牛'
          ],
          'loc': 'east',
          'best': 8
        },
        '2009': {
          'matches': [
            '骑士4-1公牛'
          ],
          'loc': 'east',
          'best': 8
        }
      }
    }
  },
  components: {
    TimeAxis
  },
  watch: {
    getTeamIndex () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-TimeLine-TeamIndex=>', this.getTeamIndex)
    },
    getHoverPlayer () {
      console.log('Watch-TimeLine-HoverPlayers=>', this.getHoverPlayer)
    }
  },
  events: {
    'time-window': function (msg1, msg2) {
      console.log('收到子组件的消息' + msg1 + ',' + msg2)
      // this.changeTimeWindow(msg1, msg2)
    }
  },
  methods: {
    changeTimeWindow (ll, rr) {
      console.log('Action-TimeLine-ChangeTimeWindow')
      this.timeWindowChange(ll, rr)
    },
    changeHoverPlayer () {
      console.log('Action-TimeLine-ChangeHoverPlayer')
      this.hoverPlayerChange(4)
    },
    getSize () {
     // console.log('========>>>height ' + $('#' + style.TimeLine).height() + 'width ' + $('#' + style.TimeLine).width())
      this.divWidth = $('#' + style.TimeLine).width()
      this.divHeight = $('#' + style.TimeLine).height()
    }
  },
  ready () {
    this.getSize()
  }
}
