/**
 * Created by huangxinxin on 2017/1/18.
 */
import style from './style.less'
import template from './template.html'
import echarts from 'echarts'

export default {
  template,
  props: [ 'chartOption' ],
  data () {
    return {
      style,
      elId: `LineChart-${(+new Date())}-${Math.random() * 100 * 1000 * 1000}`
    }
  },
  watch: {
    chartOption () {
      this.render()
    }
  },
  methods: {
    render () {
      if (this.chartOption) {
        let myChart = echarts.init(document.getElementById(this.elId))
        myChart.setOption(this.chartOption)
        myChart.on('click', (params) => {
          this.$dispatch('chart-click', params)
        })
      }
    }
  },
  ready () {
    this.render()
  }
}
