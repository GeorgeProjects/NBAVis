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
  props: [ 'width', 'height', 'teamData' ],
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
      timeWindowRight: 2015
    }
  },
  watch: {
    teamData () {
      this.drawTeamInfo()
    },
    width () {
      this.drawTimeLine()
    },
    timeWindowLeft () {
      console.log(this.timeWindowLeft + ',' + this.timeWindowRight)
      this.$dispatch('time-window', this.timeWindowLeft, this.timeWindowRight)
      console.log('=======>')
    },
    timeWindowRight () {
      console.log(this.timeWindowLeft + ',' + this.timeWindowRight)
      this.$dispatch('time-window', this.timeWindowLeft, this.timeWindowRight)
      console.log('=======>')
    }
  },
  methods: {
    drawTimeLine () {
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
        .attr('fill', 'steelblue')
        .attr('fill-opacity', 0.5)
      svg.selectAll('.background')
        .attr('fill', 'steelblue')
        .attr('fill-opacity', 0.3)
        .style('visibility', 'visible')
      function brushed () {
        // console.log(thisTemp)
        y.domain(x.range()).range(x.domain())
        let extent = brush.extent()
        console.log('[' + y(extent[ 0 ]) + ',' + y(extent[ 1 ]) + ']')
        let timeLeft = Math.floor(y(extent[ 0 ])) < startYear ? startYear : Math.floor(y(extent[ 0 ]))
        let timeRight = Math.floor(y(extent[ 1 ])) > endYear ? endYear : Math.floor(y(extent[ 1 ]))
        thisTemp.timeWindowLeft = timeLeft
        thisTemp.timeWindowRight = timeRight
      }
    },
    drawTeamInfo () {
      console.log(this.teamData.teaminfo)
      if (this.teamData) {
        let svg = d3.select('#' + this.elIdSvg)
        let startYear = this.timeWindowLeft
        let endYear = this.timeWindowRight
        let x = d3.scale.ordinal().rangeRoundBands([ 0, this.width - this.padding.left - this.padding.right ])
        x.domain(d3.range(startYear, endYear + 1))
        svg.selectAll('.rectInfo-timeLine').remove()
        svg.selectAll('.circleInfo-time').remove()
        svg.selectAll('.rectInfo-timeLine')
          .data([1996, 1986, 1992, 2009])
          .enter()
          .append('rect')
          .attr('class', '.rectInfo-timeLine')
          .attr('x', function (d) {
            return x(d)
          })
          .attr('y', function (d) {
            return 0
          })
          .attr('height', function (d) {
            return 58
          })
          .attr('width', 3)
          .attr('fill', 'steelblue')
          .on('mouseover', function () {
            d3.select(this).attr('fill', 'yellow')
          })
          .on('mouseout', function () {
            d3.select(this).attr('fill', 'steelblue')
          })
        svg.selectAll('.mvpInfo-timeLine')
          .data([2009, 1992])
          .enter()
          .append('image')
          .attr('class', '.mvpInfo-timeLine')
          .attr('x', function (d) {
            return x(d) - 2
          })
          .attr('y', function (d) {
            return 10
          })
          .attr('width', 40)
          .attr('height', 40)
          .attr('xling:href', mvp)
          .on('mouseover', function () {
            d3.select(this).attr('width', 50).attr('height', 50)
          })
          .on('mouseout', function () {
            d3.select(this).attr('width', 40).attr('height', 40)
          })
        // svg.selectAll('.circleInfo-timeLine')
        //   .data([2009, 1992])
        //   .enter()
        //   .append('circle')
        //   .attr('class', '.circleInfo-timeLine')
        //   .attr('cx', function (d) {
        //     return x(d) - 2
        //   })
        //   .attr('cy', function (d) {
        //     return 30
        //   })
        //   .attr('r', 8)
        //   .attr('fill', 'green')
        //   .attr('fill-opacity', 0.6)
        //   .on('mouseover', function () {
        //     d3.select(this).attr('fill', 'red')
        //   })
        //   .on('mouseout', function () {
        //     d3.select(this).attr('fill', 'green')
        //       .attr('fill-opacity', 0.6)
        //   })
      }
    }
  },
  ready () {
  }
}
