/**
 * Created by huangxinxin on 16/8/24.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import utils from './utils'
import * as types from './mutations'

Vue.use(Vuex)
Vue.prototype.VuexUtils = utils
Vue.prototype.VuexMutations = types

const state = {
  ctx: null,
  activeRouter: null,
  timeWindow: {
    start: 1985,
    end: 2015
  },
  hoverPlayerIndex: 0,
  teamIndex: 5,
  selectedPlayerIndex: [],
  status: {
    url: null
  }
}

const mutations = {
  [types.URL_CHANGE] (state, ctx, router) {
    state.ctx = ctx
    state.activeRouter = router
    utils.setStatus(state, 'url', types.URL_CHANGE)
  },
  [types.TEAM_CHANGE] (state, teamIndex, teamColor) {
    state.teamIndex = {'teamIndex': teamIndex, 'teamColor': teamColor}
    state.selectedPlayerIndex = []
  },
  [types.HOVER_PLAYER_CHANGE] (state, hoverPlayerIndex) {
    state.hoverPlayerIndex = hoverPlayerIndex
  },
  [types.TIMEWINDOW_CHANGE] (state, start, end) {
    state.timeWindow = {'start': start, 'end': end}
  },
  [types.SELECTED_PLAYER_CHANGE] (state, playerIndex) {
    console.log('playerIndex', playerIndex)
    var newSelectPlayers = []
    var oldSelectPlayers = state.selectedPlayerIndex
    for (let i = 0; i < oldSelectPlayers.length; i++) {
      newSelectPlayers.push(oldSelectPlayers[i])
    }
    if (newSelectPlayers.indexOf(playerIndex) === -1) {
      newSelectPlayers.push(playerIndex)
    } else {
      let thisIndex = newSelectPlayers.indexOf(playerIndex)
      newSelectPlayers.splice(thisIndex, 1)
    }
    console.log('newSelectPlayers', newSelectPlayers)
    state.selectedPlayerIndex = newSelectPlayers
  }
}

export default new Vuex.Store({
  strict: true,
  state, mutations
})
