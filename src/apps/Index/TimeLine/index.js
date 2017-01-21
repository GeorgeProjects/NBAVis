import style from './style.less'
import template from './template.html'
import $ from 'jquery'
import {getTeamIndex, getHoverPlayer} from '../../../vuex/getters'
import {timeWindowChange, hoverPlayerChange} from '../../../vuex/actions'

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
      teamColor: null
    }
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
  methods: {
    changeTimeWindow () {
      console.log('Action-TimeLine-ChangeTimeWindow')
      this.timeWindowChange(5, 8)
    },
    changeHoverPlayer () {
      console.log('Action-TimeLine-ChangeHoverPlayer')
      this.hoverPlayerChange(4)
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
    }
  }
}
