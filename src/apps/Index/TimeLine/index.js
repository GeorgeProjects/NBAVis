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
      teamRecords: null,
      teamColor: null,
      divWidth: 0,
      divHeight: 0
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
      this.changeTimeWindow(msg1, msg2)
    },
    'player-id': function (msg) {
      console.log('队员id变化')
      this.changeHoverPlayer(msg)
    }
  },
  methods: {
    changeTimeWindow (ll, rr) {
      console.log('Action-TimeLine-ChangeTimeWindow')
      this.timeWindowChange(ll, rr)
    },
    changeHoverPlayer (id) {
      console.log('Action-TimeLine-ChangeHoverPlayer')
      this.hoverPlayerChange(id)
    },
    getTeamInfo () {
      let teamIndex = 4
      $.getJSON('/get_each_team_records', { id: teamIndex }, (teamRecords) => {
        console.log('teamRecords', teamRecords)
        this.teamRecords = teamRecords
      })
    },
    getTeamColor () {
      $.getJSON('/get_team_color', (teamColor) => {
        console.log('teamColor', teamColor)
        this.teamColor = teamColor
      })
    },
    getSize () {
      this.divWidth = $('#' + style.TimeLine).width()
      this.divHeight = $('#' + style.TimeLine).height()
      console.log(this.divHeight + ',' + this.divWidth)
    }
  },
  ready () {
    this.getSize()
  }
}
