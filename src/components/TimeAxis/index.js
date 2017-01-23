/**
 * created by Guozheng Li on 1/19/2017
 */
import style from './style.less'
import template from './template.html'
import d3 from 'd3'
import mvp from '../../../assets/images/mvp.png'
// import $ from 'jquery'

export default {
  template,
  props: [ 'width', 'height', 'teamData', 'tColor'],
  data () {
    return {
      style,
      elId: `TimeAxis-${(+new Date())}-${Math.floor(Math.random() * 100 * 1000 * 1000)}`,
      elIdSvg: `TimeAxisSvg-${(+new Date())}-${Math.floor(Math.random() * 100 * 1000 * 1000)}`,
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 20
      },
      timeWindowLeft: 1985,
      timeWindowRight: 2015,
      playerSelect: -1
    }
  },
  watch: {
    teamData () {
      this.drawTeamInfo()
    },
    tColor () {
      this.init()
    },
    width () {
      this.drawTimeLine()
    },
    timeWindowLeft () {
      console.log('changeTimeWindow=======>' + this.timeWindowLeft + ',' + this.timeWindowRight)
      this.$dispatch('time-window', this.timeWindowLeft, this.timeWindowRight)
      console.log('=======>')
    },
    timeWindowRight () {
      console.log('changeTimeWindow======>' + this.timeWindowLeft + ',' + this.timeWindowRight)
      this.$dispatch('time-window', this.timeWindowLeft, this.timeWindowRight)
      console.log('=======>')
    },
    playerSelect () {
      console.log('changeHoverPlayer======>' + this.playerSelect)
      this.$dispatch('player-id', this.playerSelect)
      console.log('=======>')
    }
  },
  methods: {
    drawTimeLine () { // 绘制时间轴，获得长宽数值时调用
      let thisTemp = this // js中的对象类型为引用类型
      let startYear = this.timeWindowLeft
      let endYear = this.timeWindowRight
      let x = d3.scale.ordinal().rangeRoundBands([ 0, this.width - this.padding.left - this.padding.right ])
      let y = d3.scale.linear().range([ this.height - this.padding.bottom, 0 ])
      let svg = d3.select('#' + this.elIdSvg)
      x.domain(d3.range(startYear, endYear + 1))
      console.log('---->' + d3.range(startYear, endYear + 1))
      let xAxis = d3.svg.axis().scale(x).tickValues([ 1985, 1990, 1995, 2000, 2005, 2010, 2015 ])
        .orient('bottom')
      svg.append('g')
        .attr('class', style.axis)
        .attr('transform', 'translate(' + this.padding.left + ',' + (this.height - this.padding.bottom) + ')')
        .call(xAxis)
      let brush = d3.svg.brush()
        .x(x)
        .extent([ 0, 1 ])
        .on('brushend', brushed)
      svg.append('g')
        .attr('class', style.brush)
        .attr('transform', 'translate(' + this.padding.left + ',' + (this.height - this.padding.bottom) + ')')
        .call(brush)
        .selectAll('rect')
        .attr('y', -60)
        .attr('height', 60)
      svg.selectAll('.extent')
        .attr('fill', 'grey')
        .attr('fill-opacity', 0.3)
      svg.selectAll('.background')
        .attr('fill', 'grey')
        .attr('fill-opacity', 0.2)
        .style('visibility', 'visible')
      function brushed () {
        // console.log(thisTemp)
        y.domain(x.range()).range(x.domain())
        let extent = brush.extent()
        console.log('[' + y(extent[ 0 ]) + ',' + y(extent[ 1 ]) + ']')
        if (extent[ 0 ] === extent[ 1 ]) { // 选区为空，重置为全长
          thisTemp.timeWindowLeft = startYear
          thisTemp.timeWindowRight = endYear
        } else {
          let timeLeft = Math.floor(y(extent[ 0 ])) < startYear ? startYear : Math.floor(y(extent[ 0 ]))
          let timeRight = Math.floor(y(extent[ 1 ])) > endYear ? endYear : Math.floor(y(extent[ 1 ]))
          thisTemp.timeWindowLeft = timeLeft
          thisTemp.timeWindowRight = timeRight
        }
      }
    },
    drawTeamInfo () { // 绘制时间轴上的队伍信息
      if (this.teamData) {
        console.log(this.teamData.teaminfo)
        // 计算总冠军的年份，MVP成员id(push的时候[year, id])
        let yearChampion = []
        for (var year in this.teamData.teaminfo) {
          if (this.teamData.teaminfo[year].best === 0) {
            yearChampion.push([ parseInt(year), 2 ])  // 2-->this.teamData.teaminfo[year].mvp
          }
        }
        console.log(yearChampion)
        let thisTemp = this
        let svg = d3.select('#' + this.elIdSvg)
        let startYear = 1985  // 这两个属性对于绘制队伍信息而言是固定的
        let endYear = 2015
        let x = d3.scale.ordinal().rangeRoundBands([ 0, this.width - this.padding.left - this.padding.right ])
        x.domain(d3.range(startYear, endYear + 1))
        // 清空svg上原来的元素
        svg.selectAll('.rectInfo-timeLine').remove()
        svg.selectAll('.circleInfo-time').remove()
        // 绘制总冠军年份的bar
        svg.selectAll('.rectInfo-timeLine')
          .data(yearChampion)
          .enter()
          .append('rect')
          .attr('class', '.rectInfo-timeLine')
          .attr('x', function (d) {
            return x(d[ 0 ])
          })
          .attr('y', function (d) {
            return 0
          })
          .attr('height', function (d) {
            return 58
          })
          .attr('width', 3)
          .attr('fill', 'grey')
          .on('mouseover', function () {
            d3.select(this).attr('fill', 'yellow')
            // 显示信息
          })
          .on('mouseout', function () {
            d3.select(this).attr('fill', 'grey')
          })
        // 绘制MVP成员
        svg.selectAll('.mvpInfo-timeLine')
          .data(yearChampion)
          .enter()
          .append('image')
          .attr('class', '.mvpInfo-timeLine')
          .attr('x', function (d) {
            return x(d[ 0 ]) - 2
          })
          .attr('y', function (d) {
            return 10
          })
          .attr('width', 40)
          .attr('height', 40)
          .attr('xling:href', mvp)
          .on('mouseover', function (d) {
            d3.select(this).attr('width', 50).attr('height', 50)
            // 改变hover的球员id
            thisTemp.playerSelect = d[ 1 ]
          })
          .on('mouseout', function () {
            d3.select(this).attr('width', 40).attr('height', 40)
          })
      }
    },
    init () {
      // console.log('初始化' + this.tColor.teamcolor)
      // for (var team in this.tColor.teamcolor) {
      //   console.log(this.tColor.teamcolor[team])
      //   let arr = this.tColor.teamcolor[team].split(',')
      //   console.log('====' + arr[0])
      // }
    }
  },
  ready () {
    this.drawTimeLine()
  }
}
