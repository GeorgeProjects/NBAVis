/**
 * created by Guozheng Li on 1/19/2017
 */
import style from './style.less'
import template from './template.html'
import d3 from 'd3'
// import $ from 'jquery'

export default {
  template,
  props: [ 'chartOption' ],
  data () {
    return {
      style,
      eLId: `HistogramChart-${(+new Date())}-${Math.random() * 100 * 1000 * 1000}`,
      width: 0,
      height: 0,
      margin: {
        left: 10,
        right: 10
      }
    }
  },
  watch: {
    chartOption () {
      this.render()
    }
  },
  computed: {
    padded () {
      const width = this.width - this.margin.left - this.margin.right
      const height = this.height - this.margin.top - this.margin.bottom
      return { width, height }
    }
  },
  methods: {
    render () {
      this.width = this.$el.offsetWidth
      this.height = this.$el.offsetHeight
      console.log('width=>', this.width)
      console.log('height=>', this.height)
      if (this.chartOption) {
        var data = this.chartOption
        console.log('this.option=>', this.chartOption)
        d3.select('#svg-g')
          .selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('height', function (d, i) {
            return +d.age
          })
          .attr('width', function (d, i) {
            return 5
          })
          .attr('x', function (d, i) {
            return 6 * i
          })
          .attr('class', function (d, i) {
            return style.bar
          })
      }
    }
  },
  ready () {
    this.render()
  }
}
