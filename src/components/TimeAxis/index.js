/**
 * created by Guozheng Li on 1/19/2017
 */
import style from './style.less'
import template from './template.html'
import d3 from 'd3'
// import $ from 'jquery'

export default {
  template,
  props: [ 'width', 'height', 'start', 'end', 'teamData' ],
  data () {
    return {
      style,
      elId: `TimeAxis-${(+new Date())}-${Math.floor(Math.random() * 100 * 1000 * 1000)}`,
      elIdSvg: `TimeAxisSvg-${(+new Date())}-${Math.floor(Math.random() * 100 * 1000 * 1000)}`,
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 20
      }
    }
  },
  watch: {
    teamData () {
      this.render()
    },
    width () {
      this.render()
    }
  },
  computed: {
  },
  methods: {
    showInfo () {
      console.log('===>' + this.width + ' ' + this.height)
      console.log(style['rect'])
    },
    render () {
      if (this.teamData) {
        let xScale = d3.scale.ordinal()
          .domain([1985, 2015])
          .rangeRoundBands([0, this.width - this.padding.left - this.padding.right])
        // let xScale = d3.time.scale().range([0, this.width - this.padding.left - this.padding.right])
        //   .domain([new Date(this.start, 1, 1), new Date(this.end - 1, 12, 31)])
        let xAxis = d3.svg.axis()
          .scale(xScale)
          .orient('bottom')
        d3.select('#' + this.elIdSvg)
          .append('g')
          .attr('class', style.axis)
          .attr('transform', 'translate(' + this.padding.left + ',' + 0 + ')')
          .call(xAxis)
      }
    }
  },
  ready () {
  }
}
