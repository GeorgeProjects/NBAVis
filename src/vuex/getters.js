/**
 * Created by huangxinxin on 16/6/17.
 */

export const activeUri = (state) => {
  if (state.ctx) {
    return state.ctx.path
  }
  return ''
}
export const getTimeWindow = (state) => {
  if (state.timeWindow) {
    return state.timeWindow
  }
  return null
}
export const getTeamIndex = (state) => {
  if (state.teamIndex) {
    return state.teamIndex
  }
  return null
}
export const getSelectedPlayer = (state) => {
  if (state.selectedPlayerIndex) {
    return state.selectedPlayerIndex
  }
  return null
}
export const getHoverPlayer = (state) => {
  if (state.hoverPlayerIndex) {
    return state.hoverPlayerIndex
  }
  return null
}
export const activeRouter = state => state.activeRouter
