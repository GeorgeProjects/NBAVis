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
      margin: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
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
    padded () {
    }
  },
  methods: {
    render () {
      console.log('===>' + this.width + ' ' + this.height)
      console.log(style.rect)
      d3.select('#' + this.elIdSvg)
        .selectAll('rect')
        .data([1, 2, 3, 4, 5])
        .enter()
        .append('rect')
        .attr('height', function (d, i) {
          return d
        })
        .attr('width', function (d, i) {
          return 20
        })
        .attr('x', function (d, i) {
          return 6 * i
        })
        .attr('class', function (d, i) {
          return this.style['rect']
        })
    }
  },
  ready () {
    this.render()
  }
}
