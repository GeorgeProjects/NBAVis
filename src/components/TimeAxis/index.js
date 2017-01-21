/**
 * created by Guozheng Li on 1/19/2017
 */
import style from './style.less'
import template from './template.html'
import d3 from 'd3'
import $ from 'jquery'

export default {
  template,
  props: [ 'width', 'height', 'start', 'end', 'teamData' ],
  data () {
    return {
      style,
      elId: `TimeAxis-${(+new Date())}-${Math.floor(Math.random() * 100 * 1000 * 1000)}`,
      elIdSvg: `TimeAxisSvg-${(+new Date())}-${Math.floor(Math.random() * 100 * 1000 * 1000)}`,
      padding: {
        left: 50,
        right: 50,
        top: 10,
        bottom: 20
      },
      timeWindowLeft: null,
      timeWindowRight: null
    }
  },
  watch: {
    teamData () {
      // this.render()
    },
    width () {
      this.init()
      this.drawTimeLine()
      this.drawTeamInfo()
    },
    timeWindowLeft () {
      console.log(this.timeWindowLeft + ',' + this.timeWindowRight)

    }
  },
  methods: {
    init () {
      this.timeWindowLLLeft = this.start
      this.timeWindowRRRight = this.end
    },
    drawTimeLine () {
      if (this.teamData) {
        let thisTemp = this // js中的对象类型为引用类型
        let startYear = this.start
        let endYear = this.end
        let xScale = d3.time.scale().range([ 0, this.width - this.padding.left - this.padding.right ])
          .domain([ new Date(startYear - 1, 1, 1), new Date(endYear, 12, 31) ])
        let svg = d3.select('#' + this.elIdSvg)
        svg.append('g')
          .attr('class', style.axis)
          .attr('transform', 'translate(' + this.padding.left + ',' + (this.height - this.padding.bottom) + ')')
          .call(d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(d3.time.years, 1)
            .tickFormat(function () {return null}))
          .selectAll('.tick')
          .classed(style[ 'tick--minor' ], function (d) {return d.getHours()})
        svg.append('g')
          .attr('class', style.axis)
          .attr('transform', 'translate(' + this.padding.left + ',' + (this.height - this.padding.bottom) + ')')
          .call(d3.svg.axis()
            .scale(xScale)
            .orient('bottom')
            .ticks(d3.time.years, 1)
            .tickPadding(0))
          .attr('text-anchor', null)
          .selectAll('text')
          .attr('x', 19)
        let brush = d3.svg.brush()
          .x(xScale)
          .extent([ 0, 1 ])
          .on('brushend', brushed)
        svg.append('g')
          .attr('class', style.extent)
          .attr('transform', 'translate(' + this.padding.left + ',' + (this.height - this.padding.bottom) + ')')
          .call(brush)
          .selectAll('rect')
          .attr('y', -50)
          .attr('height', 50)
        function brushed () {
          console.log(thisTemp)
          let extent = d3.event.target.extent()
          let timeLeft = extent[0].getFullYear() < startYear ? startYear : extent[ 0 ].getFullYear()
          let timeRight = extent[1].getFullYear() > endYear ? endYear : extent[ 1 ].getFullYear()
          thisTemp.timeWindowLeft = timeLeft
          thisTemp.timeWindowRight = timeRight
        }

      }
    },
    drawTeamInfo () {
      let svg = d3.select('#' + this.elIdSvg)
      svg.selectAll('.rectBrush').remove()
      svg.append('rect')
        .attr('class', 'rectBrush')
        .attr('height', 30)
        .attr('width', 30)
        .attr('x', 300)
        .attr('y', 0)
        .attr('fill', 'steelblue')
        .on('mouseover', function () {
          d3.select(this).style({opacity: '0.5'})
        })
        .on('mouseout', function () {
        d3.select(this).style({opacity: '1'})
      })
      console.log(svg.selectAll('.rectBrush'))
    }
  },
  ready () {
  }
}
