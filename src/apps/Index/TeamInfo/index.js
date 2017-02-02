import style from './style.less'
import template from './template.html'
import $ from 'jquery'
import {getTeamIndex, getTimeWindow, getSelectedPlayer, getHoverPlayer} from '../../../vuex/getters'
import {selectedPlayerChange, hoverPlayerChange} from '../../../vuex/actions'
import BarChart from '../../../components/BarChart'

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
      style,
      dataSet1: [ 0, 0 ],
      dataSet2: [ 0, 0 ],
      dataSet3: [ 0, 0 ],
      dataID: [ 0, 0 ],
      dataSets: [ {
        type: Array,
        default: [ [ 0, 0 ] ]
      } ]
    }
  },
  components: {
    BarChart
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
      $.getJSON('/get_team_player_exchange', { id: teamId }, (teamPlayerExchange) => {
        console.log('teamPlayerExchange', teamPlayerExchange)
        var labels = [ 'id', '命中', '得分', '盖帽' ]
        var yearsBegin = 1980
        // var yearEnd = 1980
        for (let i = 0; i < labels.length; i++) {
          this.dataSets[ i ] = []
          for (let j = 0; j < teamPlayerExchange[ 'teamindex' ][ yearsBegin ].length; j++) {
            this.dataSets[ i ].push(teamPlayerExchange[ 'teamindex' ][ yearsBegin ][ j ][ labels[ i ] ])
          }
          console.log('hello' + this.dataSets[ i ])
          // console.log(this.dataSets.length)
        }
        this.dataID = this.dataSets[ 0 ]
        this.dataSet1 = this.dataSets[ 1 ]
        this.dataSet2 = this.dataSets[ 2 ]
        this.dataSet3 = this.dataSets[ 3 ]
      })
    }
  }
}
