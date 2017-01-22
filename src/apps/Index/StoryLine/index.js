import style from './style.less'
import template from './template.html'
import StoryLine from '../../../components/StoryLineView'
import $ from 'jquery'
export default{
  template,
  data () {
    return {
      style,
      teamCompeteInfo: null,
      teamColor: null,
      elId: `storyline-${(+new Date())}-${Math.random() * 100 * 1000 * 1000}`
    }
  },
  components: {
    StoryLine
  },
  watch: {
  },
  methods: {
    getData () {
      $.getJSON('/api/get_team_compete_info', (data) => {
        this.teamCompeteInfo = data
      })
      $.getJSON('/api/get_team_color', (data) => {
        this.teamColor = data
      })
    }
  },
  ready () {
    this.getData()
  }
}
