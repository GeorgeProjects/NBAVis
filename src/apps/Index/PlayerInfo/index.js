import style from './style.less'
import template from './template.html'
import StarGlyph from '../../../components/StarGlyph'
import $ from 'jquery'
import {getSelectedPlayer, getTimeWindow, getHoverPlayer} from '../../../vuex/getters'
import {hoverPlayerChange} from '../../../vuex/actions'

export default{
  template,
  vuex: {
    actions: {
      hoverPlayerChange
    },
    getters: {
      getSelectedPlayer,
      getTimeWindow,
      getHoverPlayer
    }
  },
  data () {
    return {
      style,
      playerInfo: null,
      dataSet: [],
      dataSets: [],
      labels: [ '得分', '篮板', '犯规', '抢断', '助攻' ],
      maxValue: [ 0, 0, 0, 0, 0 ],
      num: 0
    }
  },
  components: {
    StarGlyph
  },
  watch: {
    getSelectedPlayer () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-PlayerInfo-PlayerIndex=>', this.getSelectedPlayer)
    },
    getTimeWindow () {
      //  可以获取teamIndex的数值,在这个地方调用渲染函数
      console.log('Watch-PlayerInfo-TimeWindow=>', this.getTimeWindow)
    },
    getHoverPlayer () {
      console.log('Watch-PlayerInfo-HoverPlayers=>', this.getHoverPlayer)
    }
  },
  methods: {
    changeHoverPlayer () {
      console.log('Action-PlayerInfo-HoverPlayers=>', this.getHoverPlayer)
      this.hoverPlayerChange(2)
    },
    // 已知球员index值, 获取球员的详细信息, 需要将球员的index值作为参数传入
    getPlayerInfo () {
      let playerIndex = [ 4, 66, 5, 11 ]
      let deferReadDataArray = []

      for (let ii = 0; ii < 4; ii++) {
        deferReadDataArray.push($.Deferred())
      }
      this.dataSets = []
      // var maxValue = new Array()
      $.when.apply($, deferReadDataArray).done(function () {
        // console.log('sssssss')
        // console.log(maxValue)
      })
      // var labels = [ '得分', '篮板', '犯规', '抢断', '助攻', '出场']
      this.num = playerIndex.length
      for (let ii = 0; ii < playerIndex.length; ii++) {
        $.getJSON('/get_player_info', { id: playerIndex[ ii ] }, (playerInfo) => {
          // console.log('playerInfo', playerInfo)
          this.playerInfo = playerInfo
          this.dataSet = []
          for (let i = 0; i < this.labels.length; i++) {
            let tmp = 0
            if (typeof playerInfo[ 'summary' ] !== 'undefined') {
              tmp = +playerInfo[ 'summary' ][ this.labels[ i ] ]
            }
            this.dataSet.push({
              axis: this.labels[ i ],
              value: tmp
            })
            if (ii === 0) {
              this.maxValue[ i ] = 0
            }
            if (tmp > this.maxValue[ i ]) {
              this.maxValue[ i ] = tmp
              // console.log('maxValue', this.maxValue)
            }
          }
          this.dataSets.push(this.dataSet)
          // console.log('ii:' + ii)
          deferReadDataArray[ ii ].resolve()
        })
      }
      // console.log(labels.length, playerIndex.length)
      // console.log(this.dataSets)
      // for (let i = 0; i < labels.length; i++) {
      //   for (let j = 0; j < playerIndex.length; j++) {
      //     console.log(i,j)
      //     console.log(this.dataSets[ j ][ i ][ 'value' ])
      //     this.dataSets[ j ][ i ][ 'value' ] = this.dataSets[ j ][ i ][ 'value' ] / maxValue[ i ]
      //   }
      // }
    }
  },
  created () {

  }
}
