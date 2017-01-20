/**
 * Created by huangxinxin on 16/6/17.
 */

export const activeUri = (state) => {
  if (state.ctx) {
    return state.ctx.path
  }
  return ''
}

export const activeRouter = state => state.activeRouter
