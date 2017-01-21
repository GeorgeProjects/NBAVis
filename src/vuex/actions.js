/**
 * Created by huangxinxin on 16/6/16.
 */
import * as types from './mutations'

export const urlChange = function (store, ...args) {
  store.dispatch(types.URL_CHANGE, ...args)
}
export const timeWindowChange = function (store, startTime, endTime) {
  console.log('action-timewindow-change')
  store.dispatch(types.TIMEWINDOW_CHANGE, startTime, endTime)
}
export const teamIndexChange = function (store, teamIndex) {
  store.dispatch(types.TEAM_CHANGE, teamIndex)
}
export const selectedPlayerChange = function (store, playerIndex) {
  console.log('action-selectplayerchange')
  console.log('playerIndex', playerIndex)
  store.dispatch(types.SELECTED_PLAYER_CHANGE, playerIndex)
}
export const hoverPlayerChange = function (store, playerIndex) {
  store.dispatch(types.HOVER_PLAYER_CHANGE, playerIndex)
}
