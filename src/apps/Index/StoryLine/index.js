import style from './style.less'
import template from './template.html'
import $ from 'jquery'
import {teamIndexChange} from '../../../vuex/actions'
import {getTimeWindow} from '../../../vuex/getters'

export default{
  template,
  vuex: {
    actions: {
      teamIndexChange
    },
    getters: {
      getTimeWindow
    }
  },
  data () {
    return {
      style,
      allTeamRecords: null,
      teamColor: null
    }
  },
  methods: {
    changeTeamIndex () {
      console.log('Action-StoryLineView-changeTeamIndex', 3)
      this.teamIndexChange(3)
    },
    getStoryLineData () {
      $.getJSON('/get_all_team_records', (allTeamRecords) => {
        console.log('allTeamRecords', allTeamRecords)
        this.allTeamRecords = allTeamRecords
      })
    },
    getTeamColor () {
      $.getJSON('/get_team_color', (teamColor) => {
        console.log('teamColor', teamColor)
        this.teamColor = teamColor
      })
    }
  },
  watch: {
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-StoryLineView-TimeWindow=>', this.getTimeWindow)
    }
  },
  created () {
    this.teamIndexChange(2)
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
