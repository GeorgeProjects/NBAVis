import style from './style.less'
import template from './template.html'
import $ from 'jquery'
import {getTeamIndex, getTimeWindow, getSelectedPlayer, getHoverPlayer} from '../../../vuex/getters'
import {selectedPlayerChange, hoverPlayerChange} from '../../../vuex/actions'
import BarChart from '../../../components/BarChart'
import StarGlyph from '../../../components/StarGlyph'

export default{
  template,
  vuex: {
    actions: {
      selectedPlayerChange,
      hoverPlayerChange
    },
    getters: {
      getTeamIndex,
      getTimeWindow,
      getSelectedPlayer,
      getHoverPlayer
    }
  },
  data () {
    return {
      style
    }
  },
  components: {
    BarChart,
    StarGlyph
  },
  watch: {
    getTeamIndex () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-TeamInfo-TeamIndex=>', this.getTeamIndex)
    },
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-TeamInfo-TimeWindow=>', this.getTimeWindow)
    },
    getSelectedPlayer () {
      console.log('Watch-TeamInfo-SelectPlayers=>', this.getSelectedPlayer)
    },
    getHoverPlayer () {
      console.log('Watch-TeamInfo-HoverPlayers=>', this.getHoverPlayer)
    }
  },
  methods: {
    changeSelectedPlayer () {
      console.log('Action-TeamInfo-ChangeSelectPlayers')
      this.selectedPlayerChange(5)
    },
    changeHoverPlayer () {
      console.log('Action-TeamInfo-changeHoverPlayer')
      this.hoverPlayerChange(3)
    },
    getTeamPlayerExchange () {
      var teamId = 4
      $.getJSON('/get_team_player_exchange', {id: teamId}, (teamPlayerExchange) => {
        console.log('teamPlayerExchange', teamPlayerExchange)
      })
    }
  }
}
