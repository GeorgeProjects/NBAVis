import style from './style.less'
import template from './template.html'
import {getTeamIndex, getTimeWindow, getSelectedPlayer, getHoverPlayer} from '../../../vuex/getters'
import {selectedPlayerChange, hoverPlayerChange} from '../../../vuex/actions'

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
  watch: {
    getTeamIndex () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-PlayerChangements-TeamIndex=>=>', this.getTeamIndex)
    },
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-PlayerChangements-TimeWindow=>', this.getTimeWindow)
    },
    getSelectedPlayer () {
      console.log('Watch-PlayerChangements-SelectPlayers=>', this.getSelectedPlayer)
    },
    getHoverPlayer () {
      console.log('Watch-PlayerChangements-HoverPlayers=>', this.getHoverPlayer)
    }
  },
  methods: {
    changeSelectedPlayer () {
      console.log('Action-PlayerChangements-SelectPlayers=>', this.getHoverPlayer)
      this.selectedPlayerChange(5)
    },
    changeHoverPlayer () {
      console.log('Action-PlayerChangements-HoverPlayers=>', this.getHoverPlayer)
      this.hoverPlayerChange(1)
    }
  },
  ready () {
  }
}
