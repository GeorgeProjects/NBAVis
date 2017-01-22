import style from './style.less'
import template from './template.html'
import d3 from 'd3'
// import $ from 'jquery'
import 'jquery'

export default {
  template,
  props: [ 'dataSet' ],
  data () {
    return {
      style,
      barChartId: 'BarChart' + Math.ceil(Math.random()*1000),
      tmpId: 'svg'+Math.ceil(Math.random()*10000)
    }
  },
  watch: {
    dataSet () {
      console.log('Chang!!')
      this.DrawBarChart()
    }
  },
  methods: {
    DrawBarChart () {
      // 在 body 里添加一个 SVG 画布
      d3.select('#'+this.tmpId).remove()
      var width = $('#'+this.barChartId).width()
      var height = $('#'+this.barChartId).height()
      var svg = d3.select('#'+this.barChartId)
        .append('svg')
        .attr('class', style['bar-chartsvg'])
        .attr('id', this.tmpId)

      // 画布周边的空白
      var padding = { left: 30, right: 30, top: 20, bottom: 20 }

      // 定义一个数组
      var dataset = this.dataSet

      // x轴的比例尺
      var xScale = d3.scale.ordinal()
        .domain(d3.range(dataset.length))
        .rangeRoundBands([ 0, width - padding.left - padding.right ])

      // y轴的比例尺
      var yScale = d3.scale.linear()
        .domain([ 0, d3.max(dataset) ])
        .range([ height - padding.top - padding.bottom, 0 ])

      // 定义x轴
      var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom')

      // 定义y轴
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')

      // 矩形之间的空白
      var rectPadding = 4

      // 添加矩形元素
      svg.selectAll('.MyRect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', style.MyRect)
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .attr('x', function (d, i) {
          return xScale(i) + rectPadding / 2
        })
        .attr('y', function (d) {
          return yScale(d)
        })
        .attr('width', xScale.rangeBand() - rectPadding)
        .attr('height', function (d) {
          return height - padding.top - padding.bottom - yScale(d)
        })

      // 添加文字元素
      // svg.selectAll('.MyText')
      //   .data(dataset)
      //   .enter()
      //   .append('text')
      //   .attr('class', style['MyText'])
      //   .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      //   .attr('x', function (d, i) {
      //     return xScale(i) + rectPadding / 2
      //   })
      //   .attr('y', function (d) {
      //     return yScale(d)
      //   })
      //   .attr('dx', function () {
      //     return (xScale.rangeBand() - rectPadding) / 2
      //   })
      //   .attr('dy', function (d) {
      //     return 20
      //   })
      //   .text(function (d) {
      //     return d
      //   })

      // 添加x轴
      svg.append('g')
        .attr('class', style['axis'])
        .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
        .call(xAxis)

      // 添加y轴
      svg.append('g')
        .attr('class', style['axis'])
        .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
        .call(yAxis)
    }
  },
  ready () {
    this.DrawBarChart()
  }
}

