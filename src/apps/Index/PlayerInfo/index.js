import style from './style.less'
import template from './template.html'
import BarChart from '../../../components/BarChart'

export default{
  template,
  data () {
    return {
      style,
      dataSet: [100, 50, 56, 56, 66]
    }
  },
  components: {
    BarChart
  },
  methods: {
    testData () {
      setInterval(() => {
        console.log('加数据!')
        this.dataSet.push(Math.random() * 100)
      }, 1000)
    }
  },
  created () {
    // 测试子组件BarChart是否能够watch dataSet的变化
    // this.testData()
  }
}
