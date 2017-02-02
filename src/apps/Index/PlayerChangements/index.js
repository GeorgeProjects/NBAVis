import style from './style.less'
import template from './template.html'
import {getTeamIndex, getTimeWindow, getSelectedPlayer, getHoverPlayer} from '../../../vuex/getters'
import {selectedPlayerChange, hoverPlayerChange} from '../../../vuex/actions'
import $ from 'jquery'
import d3 from 'd3'

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
      elId: `player-${(+new Date())}-${Math.random() * 100 * 1000 * 1000}`, // $ {} 使用字符串的值连接
      locations: [ '前锋', '中锋', '后卫' ]
    }
  },
  watch: {
    getTeamIndex () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      this.color = this.getTeamIndex[ 'teamColor' ]
      console.log('Watch-PlayerChangements-TeamIndex=>=>', this.getTeamIndex)
      this.render(this.getTeamIndex[ 'teamIndex' ], this.getTimeWindow.start, this.getTimeWindow.end)
    },
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      this.color = this.getTeamIndex[ 'teamColor' ]
      console.log('Watch-PlayerChangements-TimeWindow=>', this.getTimeWindow)
      this.render(this.getTeamIndex[ 'teamIndex' ], this.getTimeWindow.start, this.getTimeWindow.end)
    },
    getSelectedPlayer () {
      console.log('Watch-PlayerChangements-SelectPlayers=>', this.getSelectedPlayer)
    },
    getHoverPlayer () {
      console.log('Watch-PlayerChangements-HoverPlayers=>', this.getHoverPlayer)
    }
  },
  methods: {
    render (team, start, end) {
      let self = this
      let rencolor = this.color // 改为 this.color
      let width = this.$el.clientWidth
      let height = this.$el.clientHeight
      let margin = { left: 10, right: 80, top: 10, bottom: 10 }
      let svg = d3.select('#playersvg')
      svg.selectAll('*').remove()
      svg.attr('width', width)
        .attr('height', height)
      let ti = []
      let syear = -1
      let eyear = -1
      let midnum = 0
      let frontnum = 0
      let backnum = 0
      $.getJSON('/get_team_player_exchange', { id: team }, (teamPlayerExchange) => {
        console.log('teamPlayerExchange', teamPlayerExchange)
        let d = teamPlayerExchange
        let tempfront = 0
        let tempmid = 0
        let tempback = 0
        for (let i = start; i <= end; ++i) {  // will be start & end
          ti[ i ] = d[ 'teamindex' ][ i ]  // data form will be changed
          for (let j = 0; j < ti[ i ].length; ++j) {
            if (ti[ i ][ j ][ '位置' ] === '后卫') tempback++
            else if (ti[ i ][ j ][ '位置' ] === '中锋') tempmid++
            else tempfront++
          }
          if (tempfront > frontnum) frontnum = tempfront
          if (tempmid > midnum) midnum = tempmid
          if (tempback > backnum) backnum = tempback
          tempfront = tempmid = tempback = 0
          if (d[ 'teamindex' ][ i ].length > 0) { // data form will be changed
            if (syear === -1) {
              syear = i
            } else {
              eyear = i
            }
          }
        }
        if (syear === -1) return
        if (eyear > 2016) return
        let lyear = end - start + 1
        let num = frontnum + midnum + backnum
        let xlength = (width - margin.left - margin.right) / lyear
        let yaxis = d3.scale.linear()
          .domain([ 0, num ])
          .range([ height, 0 ])
        let ylength = height / num
        let paintarray = []
        let usable = []
        for (let i = 0; i <= 50; ++i) {
          paintarray[ i ] = []
          usable[ i ] = []
          for (let j = 0; j <= num; ++j) {
            paintarray[ i ][ j ] = 'null'
            usable[ i ][ j ] = true
          }
        }
        for (let i = start; i <= end; ++i) { // will be start & end
          if (i === start) {
            for (let j = 0; j < ti[ i ].length; ++j) {
              svg.append('rect')
                .attr('id', function () {
                  return 'id' + ti[ i ][ j ].id
                })
                .attr('position', function () {
                  return ti[ i ][ j ].位置
                })
                .attr('x', function () {
                  return margin.left
                })
                .attr('y', function (d) {
                  let t = -1
                  if (ti[ i ][ j ].位置 === '后卫') {
                    tempback++
                    t = tempback
                  } else if (ti[ i ][ j ].位置 === '中锋') {
                    tempmid++
                    t = backnum + tempmid
                  } else {
                    tempfront++
                    t = backnum + midnum + tempfront
                  }
                  paintarray[ 0 ][ t ] = ti[ i ][ j ].id
                  return yaxis(t)
                })
                .attr('height', function () {
                  return 0.6 * ylength
                })
                .attr('width', function () {
                  return 0.8 * xlength + margin.left
                })
                .attr('class', 'headrect')
                .attr('playerid', ti[ i ][ j ].id)
                .style('fill', rencolor)
            }
            tempback = tempfront = tempmid = 0
          } else {
            let ty = i - start
            for (let j = 0; j < paintarray[ ty - 1 ].length; ++j) {
              if (paintarray[ ty - 1 ][ j ] !== 'null') {
                for (let k = 0; k < ti[ i ].length; ++k) {
                  if (paintarray[ ty - 1 ][ j ] === ti[ i ][ k ].id) {
                    svg.append('rect')
                      .attr('y', function () {
                        return yaxis(j)
                      })
                      .attr('x', function () {
                        return ty * xlength - 0.0 * xlength
                      })
                      .attr('height', 0.6 * ylength)
                      .attr('width', 1.0 * xlength)
                      .attr('id', 'id' + ti[ i ][ k ].id)
                      .attr('class', 'bodyrect')
                      .attr('playerid', ti[ i ][ k ].id)
                      .style('fill', rencolor)
                    paintarray[ ty ][ j ] = paintarray[ ty - 1 ][ j ]
                    usable[ ty ][ j ] = false
                    ti[ i ].splice(k, 1)
                    break
                  }
                }
              }
            }
            for (let j = 0; j < ti[ i ].length; ++j) {
              let here = 1
              svg.append('rect')
                .attr('y', function () {
                  if (ti[ i ][ j ].位置 === '后卫') {
                    here = 1
                  } else if (ti[ i ][ j ].位置 === '中锋') {
                    here = backnum + 1
                  } else {
                    here = backnum + midnum + 1
                  }
                  while (!usable[ ty ][ here ]) {
                    here++
                  }
                  usable[ ty ][ here ] = false
                  paintarray[ ty ][ here ] = ti[ i ][ j ].id
                  return yaxis(here)
                })
                .attr('x', function () {
                  return ty * xlength + 0.2 * xlength
                })
                .attr('height', 0.6 * ylength)
                .attr('width', 0.8 * xlength)
                .attr('id', 'id' + ti[ i ][ j ].id)
                .attr('class', 'headrect')
                .attr('playerid', ti[ i ][ j ].id)
                .style('fill', rencolor)
            }
          }
        }
        svg.selectAll('rect')
          .on('mouseover', function (d) {
            let v = d3.select(this).attr('id')
            svg.selectAll('#' + v).style('fill-opacity', 1).attr('height', 1.5 * d3.select(this).attr('height')).attr('width', 1.2 * (+d3.select(this).attr('width')))
            self.hoverPlayerChange(+d3.select(this).attr('playerid'))
          })
          .on('mouseout', function (d) {
            let v = d3.select(this).attr('id')
            svg.selectAll('#' + v).style('fill-opacity', function () {
              if (d3.select(this).style('fill') !== 'rgb(128, 128, 129)') {
                return 0.5
              }
              return 0.4
            }).attr('height', d3.select(this).attr('height') / 1.5).attr('width', function (d) {
              let cthis = d3.select(this).attr('class')
              if (cthis === 'headrect') {
                return 0.8 * xlength
              } else {
                return 1.0 * xlength
              }
            })
          })
          .on('click', function (d) {
            let v = d3.select(this).attr('id')
            let tv = d3.select(this).attr('playerid')
            self.selectedPlayerChange(+tv)
            if (d3.select(this).style('fill') !== 'rgb(128, 128, 129)') {
              svg.selectAll('#' + v).style('fill', rencolor)
            } else {
              svg.selectAll('#' + v).style('fill', rencolor)
            }
          })
        let textsvg = svg.append('g').attr('transform', 'translate(' + (width - margin.right) + ',0)')
        textsvg.append('text').text(' 前 锋').attr('x', function () {
          return 10
        })
          .attr('y', function () {
            return yaxis(backnum + midnum + 1)
          })
        textsvg.append('text').text(' 中 锋').attr('x', function () {
          return 10
        })
          .attr('y', function () {
            return yaxis(backnum + 1)
          })
        textsvg.append('text').text(' 后 卫').attr('x', function () {
          return 10
        })
          .attr('y', function () {
            return yaxis(0 + 1)
          })
        textsvg.append('line').attr('x1', 0).attr('y1', yaxis(backnum + midnum))
          .attr('x2', d3.select('#player-year-chart').style('width')).attr('y2', yaxis(backnum + midnum))
          .attr('stroke', 'black')
          .style('stroke-width', 1)
        textsvg.append('line').attr('x1', 0).attr('y1', yaxis(backnum))
          .attr('x2', d3.select('#player-year-chart').style('width')).attr('y2', yaxis(backnum))
          .attr('stroke', 'black')
        textsvg.append('line').attr('x1', 0).attr('y1', yaxis(0))
          .attr('x2', d3.select('#player-year-chart').style('width')).attr('y2', yaxis(0))
          .attr('stroke', 'black')
      })
    },
    changeSelectedPlayer () {
      console.log('Action-PlayerChangements-SelectPlayers=>', this.getHoverPlayer)
      this.selectedPlayerChange(5)
    },
    changeHoverPlayer () {
      console.log('Action-PlayerChangements-HoverPlayers=>', this.getHoverPlayer)
      this.hoverPlayerChange(1)
    },
    getTeamPlayerExchange () {
      $.getJSON('/get_team_player_exchange', { id: 4 }, (teamPlayerExchange) => {
        console.log('teamPlayerExchange', teamPlayerExchange)
      })
    }
  },
  ready () {
    // this.render(3, 1985, 2005)
  }
}
