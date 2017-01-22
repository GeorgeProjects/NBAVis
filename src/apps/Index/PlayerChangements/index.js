import style from './style.less'
import template from './template.html'
import {getTeamIndex, getTimeWindow, getSelectedPlayer, getHoverPlayer} from '../../../vuex/getters'
import {selectedPlayerChange, hoverPlayerChange} from '../../../vuex/actions'
import d3 from 'd3'
import $ from 'jquery'
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
  props: [ 'playerInfoData', 'teamIndexData' ],
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
      console.log('Watch-PlayerChangements-TeamIndex=>=>', this.getTeamIndex)
      this.render(this.getTeamIndex, this.getTimeWindow.start, this.getTimeWindow.end)
    },
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-PlayerChangements-TimeWindow=>', this.getTimeWindow)
      this.render(this.getTeamIndex, this.getTimeWindow.start, this.getTimeWindow.end)
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
      let width = parseInt(d3.select('#team-year-chart').style('width'))
      let height = parseInt(d3.select('#team-year-chart').style('height'))
      // let margin = { top: 10, right: 10, bottom: 10, left: 10 }
      let svg = d3.select('#team-year-chart')
      let ti = []
      let syear = -1
      let eyear = -1
      let midnum = 0
      let frontnum = 0
      let backnum = 0
      $.getJSON('/api/get_team_info', function (d) {
        let tempfront = 0
        let tempmid = 0
        let tempback = 0
        for (let i = 1985; i <= 2016; ++i) {  // will be start & end
          ti[ i ] = d[ 'teamindex' ][ '达拉斯小牛' ][ i ]  // data form will be changed
          for (let j = 0; j < ti[ i ].length; ++j) {
            if (ti[ i ][ j ][ '位置' ] === '后卫') tempback++
            else if (ti[ i ][ j ][ '位置' ] === '中锋') tempmid++
            else tempfront++
          }
          if (tempfront > frontnum) frontnum = tempfront
          if (tempmid > midnum) midnum = tempmid
          if (tempback > backnum) backnum = tempback
          tempfront = tempmid = tempback = 0
          if (d[ 'teamindex' ][ '达拉斯小牛' ][ i ].length > 0) { // data form will be changed
            if (syear === -1) {
              syear = i
            } else {
              eyear = i
            }
          }
        }
        if (syear === -1) return
        let lyear = eyear - syear + 1
        let xaxis = d3.scale.linear()
          .domain([ syear, eyear + 1 ]) // will be start & end
          .range([ 0, width ])
        let num = frontnum + midnum + backnum
        let xlength = width / lyear
        let yaxis = d3.scale.linear()
          .domain([ 1, num ])
          .range([ height, 0 ])
        let ylength = height / num
        // console.log('aaaaaqqq', yaxis(1), yaxis(2), yaxis(3), width, num, frontnum, midnum, backnum, xlength, ylength)
        for (let i = syear; i <= eyear; ++i) { // will be start & end
          for (let j = 0; j < ti[ i ].length; ++j) {
            /* let t = +ti[ i ][ j ][ 'id' ] */
            svg.append('rect').attr('stroke', 'black').attr('fill', 'gray').attr('y', function () {
              if (ti[ i ][ j ][ '位置' ] === '后卫') {
                tempback++
                return yaxis(midnum + frontnum + tempback)
              }
              if (ti[ i ][ j ][ '位置' ] === '中锋') {
                tempmid++
                return yaxis(frontnum + tempmid)
              }
              tempfront++
              return yaxis(tempfront)
            })
              .attr('x', xaxis(i)).attr('width', xlength).attr('height', ylength)
          }
          tempfront = 0
          tempmid = 0
          tempback = 0
        }
        let idtable = []
        for (let i = syear; i <= eyear; ++i) {
          idtable[i] = {}
          for (let j = 0; j < ti[ i ].length; ++j) {
            let id = ti[ i ][ j ][ 'id' ]
            idtable[i].id = {'last': 0}
          }
        }
      })
    },
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
