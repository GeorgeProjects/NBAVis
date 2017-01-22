import style from './style.less'
import template from './template.html'
import $ from 'jquery'
import {getSelectedPlayer, getTimeWindow, getHoverPlayer} from '../../../vuex/getters'
import {hoverPlayerChange} from '../../../vuex/actions'

export default{
  template,
  vuex: {
    actions: {
      hoverPlayerChange
    },
    getters: {
      getSelectedPlayer,
      getTimeWindow,
      getHoverPlayer
    }
  },
  data () {
    return {
      style,
      playerInfo: null
    }
  },
  watch: {
    getSelectedPlayer () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-PlayerInfo-PlayerIndex=>', this.getSelectedPlayer)
    },
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-PlayerInfo-TimeWindow=>', this.getTimeWindow)
    },
    getHoverPlayer () {
      console.log('Watch-PlayerInfo-HoverPlayers=>', this.getHoverPlayer)
    }
  },
  methods: {
    changeHoverPlayer () {
      console.log('Action-PlayerInfo-HoverPlayers=>', this.getHoverPlayer)
      this.hoverPlayerChange(2)
    },
    // 已知球员index值, 获取球员的详细信息, 需要将球员的index值作为参数传入
    getPlayerInfo () {
      let playerIndex = 4
      $.getJSON('/get_player_info', { id: playerIndex }, (playerInfo) => {
        console.log('playerInfo', playerInfo)
        this.playerInfo = playerInfo
      })
    }
  }
}
