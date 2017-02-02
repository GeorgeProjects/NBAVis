import style from './style.less'
import template from './template.html'
import {teamIndexChange} from '../../vuex/actions'
import {getTimeWindow, getSelectedPlayer} from '../../vuex/getters'
import d3 from 'd3'
import $ from 'jquery'
export default{
  template,
  vuex: {
    actions: {
      teamIndexChange
    },
    getters: {
      getTimeWindow,
      getSelectedPlayer
    }
  },
  props: [ 'teamCompeteInfo', 'teamColor' ],
  data () {
    return {
      style,
      elId: `storyline-${(+new Date())}-${Math.random() * 100 * 1000 * 1000}`
    }
  },
  watch: {
    teamCompeteInfo () {
      this.render(this.getTimeWindow)
    },
    getTimeWindow () {
      this.setTimeWindow(this.getTimeWindow)
    },
    getSelectedPlayer () {
      this.selectedPlayerResponse(this.getSelectedPlayer)
    },
    getHoverPlayer () {
      console.log('=>storyLine', this.getHoverPlayer)
      this.selectedPlayerResponse(this.getHoverPlayer)
    }
  },
  methods: {
    selectedPlayerResponse (selectedPlayer) {
      // console.log(selectedPlayer)
      $.getJSON('/get_player_info', { id: selectedPlayer[ selectedPlayer.length - 1 ] }, (playerInfo) => {
        let yearlyData = playerInfo[ 'teamexperience' ]
        let pureData = []
        console.log('==>', selectedPlayer[ selectedPlayer.length - 1 ])
        for (let yearstr in yearlyData) {
          if (yearlyData[ yearstr ] === '总计') continue
          pureData.push({ 'year': +yearstr, 'team': yearlyData[ yearstr ] })
        }
        pureData.sort((a, b) => {
          return a[ 'year' ] - b[ 'year' ]
        })
        // console.log('==>player', pureData)
        let teamPathPoints = this.teamPathPoints
        let teams = Object.keys(teamPathPoints)
        this.svg.selectAll('.' + this.style[ 'team-path' ]).style('stroke', 'grey').style('opacity', 0.4)
        let teamColor = this.colorData
        let pointsArray = []
        let beforeTeam = ''
        for (let i in pureData) {
          if (pureData[ i ][ 'year' ] < this.yStart || pureData[ i ][ 'year' ] > this.yEnd) {
            continue
          }
          let team = ''
          for (let j in teams) {
            if (pureData[ i ][ 'team' ].indexOf(teams[ j ]) >= 0) {
              team = teams[ j ]
              break
            }
          }
          if (team === '') continue
          if (team !== beforeTeam) {
            console.log('==>team', team, teamColor[ 'team' + team ])
            let colorT = ''
            if (beforeTeam === '') {
              colorT = team
            } else {
              colorT = beforeTeam
            }
            this.svg.append('path')
              .attr('class', (d, i) => {
                return this.style[ 'player-path' ]
              })
              .data([ pointsArray ])
              .attr('d', d3.svg.line().interpolate('basis'))
              .style('stroke', teamColor[ 'team' + colorT ])
            beforeTeam = team
            pointsArray = []
            pointsArray.push(teamPathPoints[ team ][ (pureData[ i ][ 'year' ] - this.yStart) * 4 ])
            pointsArray.push(teamPathPoints[ team ][ (pureData[ i ][ 'year' ] - this.yStart) * 4 + 1 ])
          } else {
            pointsArray.push(teamPathPoints[ team ][ (pureData[ i ][ 'year' ] - this.yStart) * 4 - 2 ])
            pointsArray.push(teamPathPoints[ team ][ (pureData[ i ][ 'year' ] - this.yStart) * 4 - 1 ])
            pointsArray.push(teamPathPoints[ team ][ (pureData[ i ][ 'year' ] - this.yStart) * 4 ])
            pointsArray.push(teamPathPoints[ team ][ (pureData[ i ][ 'year' ] - this.yStart) * 4 + 1 ])
          }
        }
        if (beforeTeam !== '') {
          this.svg.append('path')
            .attr('class', (d, i) => {
              return this.style[ 'player-path' ]
            })
            .data([ pointsArray ])
            .attr('d', d3.svg.line().interpolate('basis'))
            .style('stroke', teamColor[ 'team' + beforeTeam ])
        }
      })
    },
    setTimeWindow (timeWindow) {
      this.timeWindow = timeWindow
      this.yStart = this.timeWindow.start
      this.yEnd = this.timeWindow.end
      // console.log('timewindow=>', timeWindow.start, timeWindow.end)
      this.render()
    },
    changeTeamIndex (team, color) {
      this.teamIndexChange(team, color)
    },
    init () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
      this.svg = d3.select('#story-line-svg')
        .attr('width', this.width)
        .attr('height', this.height)
      this.margin = { left: 10, right: 80, top: 10, bottom: 10 }
      this.yscale = d3.scale.ordinal()
        .domain(d3.range(11))
        .rangePoints([ 0, this.height ], 0.6) // 空白处所占的比例
      // console.log('==>yscale', this.yscale(0))
      // console.log('width', this.width, this.height)
      // console.log('=>svg', this.svg)
    },
    computeLocations (eastOrWest, best, year, team, sequences) {
      let locationArray = []
      // 上西下东
      let eastTransformObj = {
        '0': 5, '1': 6, '2': 7, '4': 8, '8': 9, '16': 10
      }
      let westTransformObj = {
        '0': 5, '1': 4, '2': 3, '4': 2, '8': 1, '16': 0
      }
      let project = { '0': 0, '1': 1, '2': 2, '4': 3, '8': 4, '16': 5 }
      let top = 0
      let left = 0
      let sbias = 2.5
      let bias = 0
      let vbias = 0
      let ysquence = sequences[ eastOrWest ][ year ]
      let sNum = project[ best ]
      // console.log('-->>ss', ysquence, sNum)
      if (sNum === 1) {
        vbias = this.levelHeight * 2.3
      } else if (sNum === 2) {
        vbias = this.levelHeight * 2.3
      } else if (sNum === 3) {
        vbias = this.levelHeight * 2
        let index = ysquence[ sNum ].indexOf(team)
        if (index === 0) {
          bias = -sbias
        } else bias = sbias
      } else if (sNum === 4) {
        let index = ysquence[ sNum ].indexOf(team)
        bias = (index - 2) * sbias * 2 + sbias / 2 + 1
      }
      if (eastOrWest === 'east') {
        let leftNum = year - this.yStart
        left = leftNum * (this.timeWidth + this.timeGapWidth)
        let topNum = +eastTransformObj[ best ]
        this.teamYearRankMatrix[ team ][ year ] = topNum
        // top = topNum * (this.levelHeight + this.levelGapHeight) + bias
        top = this.yscale(topNum) + bias
      } else if (eastOrWest === 'west') {
        let leftNum = year - this.yStart
        left = leftNum * (this.timeWidth + this.timeGapWidth)
        let topNum = +westTransformObj[ best ]
        this.teamYearRankMatrix[ team ][ year ] = topNum
        // top = topNum * (this.levelHeight + this.levelGapHeight) - bias + vbias - vbias
        top = this.yscale(topNum) - bias + vbias - vbias
      }
      locationArray.push(left + this.margin.left)
      locationArray.push(top)
      return locationArray
    },
    adjust (data, start, step) {
      var exchange = function (team1, team2, arr) {
        let index1 = 100
        let index2 = 100
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < arr[ i ].length; j++) {
            if (arr[ i ][ j ] === team1) {
              index1 = i * 10 + j
            }
            if (arr[ i ][ j ] === team2) {
              index2 = i * 10 + j
            }
          }
        }
        if (index1 > index2) {
          return true
        } else return false
      }
      let year = start
      while (1) {
        if (step < 0 && year <= this.yStart) {
          break
        }
        if (step > 0 && year >= this.yEnd) {
          break
        }
        let arr1 = data[ year ]
        let arr2 = data[ year + step ]
        if (exchange(arr2[ 3 ][ 0 ], arr2[ 3 ][ 1 ], arr1)) {
          let tmp = arr2[ 3 ][ 0 ]
          arr2[ 3 ][ 0 ] = arr2[ 3 ][ 1 ]
          arr2[ 3 ][ 1 ] = tmp
        }
        for (let i = 0; i < 4; i++) {
          for (let j = i + 1; j < 4; j++) {
            if (exchange(arr2[ 4 ][ i ], arr2[ 4 ][ j ], arr1)) {
              let tmp = arr2[ 4 ][ i ]
              arr2[ 4 ][ i ] = arr2[ 4 ][ j ]
              arr2[ 4 ][ j ] = tmp
            }
          }
        }
        year = year + step
      }
    },
    computeSequences (data) {
      let yearIndexTeam = {} // [ west ]: year: [0]-冠军, [1]-地区冠军, [2]-决赛, [3]-四强, [4]-八强
      yearIndexTeam[ 'west' ] = {}
      yearIndexTeam[ 'east' ] = {}
      for (let year = this.yStart; year <= this.yEnd; year++) {
        yearIndexTeam[ 'west' ][ year ] = {}
        yearIndexTeam[ 'east' ][ year ] = {}
        for (let i = 0; i < 5; i++) {
          yearIndexTeam[ 'west' ][ year ][ i ] = []
          yearIndexTeam[ 'east' ][ year ][ i ] = []
        }
      }
      let project = { '0': 0, '1': 1, '2': 2, '4': 3, '8': 4 }
      // console.log(data)
      for (let team in data) {
        for (let year = this.yStart; year <= this.yEnd; year++) {
          if (data[ team ][ year ] === undefined) {
            continue
          }
          let best = project[ data[ team ][ year ].best ]
          let loc = data[ team ][ year ].loc
          // console.log('=>', best)
          // console.log('year=>', yearIndexTeam)
          yearIndexTeam[ loc ][ year ][ best ].push(team)
        }
      }
      // 顺序调整，两个方向1985-2015， 2015-1985
      this.adjust(yearIndexTeam[ 'west' ], this.yStart, 1)
      this.adjust(yearIndexTeam[ 'west' ], this.yEnd, -1)
      this.adjust(yearIndexTeam[ 'east' ], this.yStart, 1)
      this.adjust(yearIndexTeam[ 'east' ], this.yEnd, -1)
      return yearIndexTeam
    },
    render () {
      if (this.teamCompeteInfo && this.teamColor) {
        // console.log(this.teamCompeteInfo)
        // 必须先判断一下
        this.svg.selectAll('*').remove()
        let yStart = this.yStart
        let yEnd = this.yEnd
        this.colorData = {}
        for (let team in this.teamColor.teamcolor) {
          let colorString = this.teamColor.teamcolor[ team ].replace(' ', '')
          let colorArray = colorString.split(',')
          // console.log(colorArray)
          this.colorData[ 'team' + team ] = 'rgb(' + colorArray[ 0 ] + ',' + colorArray[ 1 ] + ',' + colorArray[ 2 ] + ')'
        }
        let timeLen = yEnd - yStart + 1
        let timeGapLen = yEnd - yStart
        let timeGapRatio = 2
        let viewWidth = this.width - this.margin.left - this.margin.right
        this.timeWidth = viewWidth / (timeLen + timeGapRatio * timeGapLen)  //  每个宽度
        this.timeGapWidth = this.timeWidth * timeGapRatio // 相距间隔
        let levelLen = 11
        let levelGapLen = 10
        let levelGapRatio = 4
        let viewHeight = this.height
        this.levelHeight = viewHeight / (levelLen + levelGapLen * levelGapRatio)
        this.levelGapHeight = this.levelHeight * levelGapRatio
        // 共有9个level的成绩，它们之间的gap有8个，level的间距与level的宽度之间的比例关系是0.5
        // 对于每一个队构建一个平滑的path
        let matchResultArray = []
        let data = this.teamCompeteInfo
        let sequences = this.computeSequences(data.teaminfo)
        let itemCount = 0
        let svg = this.svg
        this.teamYearRankMatrix = {}
        let colorData = this.colorData
        this.teamPathPoints = {}
        for (let item in data.teaminfo) {
          matchResultArray[ itemCount ] = {}
          this.teamPathPoints[ item ] = []
          this.teamYearRankMatrix[ item ] = {}
          matchResultArray[ itemCount ].team_name = item
          matchResultArray[ itemCount ].match_result = []
          for (let i = 0; i < timeLen; i++) {
            let year = yStart + i
            let attrNameArrray = Object.keys(data.teaminfo[ item ])
            let loc = data.teaminfo[ item ][ attrNameArrray[ 0 ] ].loc
            let best = 0
            if (data.teaminfo[ item ][ year ] === undefined) {
              best = 16
            } else {
              best = data.teaminfo[ item ][ year ].best
            }
            let locationArray = this.computeLocations(loc, best, year, item, sequences)
            matchResultArray[ itemCount ].match_result.push(locationArray)
          }
          let matchResultArrayAdded = []
          let lastX = 0
          let lastY = 0
          for (let i = 0; i < timeLen - 1; i++) {
            let zero = matchResultArray[ itemCount ].match_result[ i ]
            let zeroX = zero[ 0 ]
            let zeroY = zero[ 1 ]
            let firstX = zeroX + this.timeWidth
            let firstY = zeroY
            let forth = matchResultArray[ itemCount ].match_result[ i + 1 ]
            let forthX = forth[ 0 ]
            let forthY = forth[ 1 ]
            let secondX = (firstX + forthX) / 2
            let secondY = firstY
            let thirdX = (firstX + forthX) / 2
            let thirdY = forthY
            matchResultArrayAdded.push([ zeroX, zeroY ])
            matchResultArrayAdded.push([ firstX, firstY ])
            matchResultArrayAdded.push([ secondX, secondY ])
            matchResultArrayAdded.push([ thirdX, thirdY ])
            // matchResultArrayAdded.push([forthX, forthY])
            this.teamPathPoints[ item ].push([ zeroX, zeroY ])
            this.teamPathPoints[ item ].push([ firstX, firstY ])
            this.teamPathPoints[ item ].push([ secondX, secondY ])
            this.teamPathPoints[ item ].push([ thirdX, thirdY ])
            lastX = forth[ 0 ]
            lastY = forth[ 1 ]
          }
          matchResultArrayAdded.push([ lastX, lastY ])
          matchResultArrayAdded.push([ lastX + this.timeWidth, lastY ])
          this.teamPathPoints[ item ].push([ lastX, lastY ])
          this.teamPathPoints[ item ].push([ lastX + this.timeWidth, lastY ])
          let style = this.style
          let self = this
          let path = svg.append('path')
            .attr('class', (d, i) => {
              return this.style[ 'team-path' ]
            })
            .attr('id', 'team' + item)
            .data([ matchResultArrayAdded ])
            .attr('d', d3.svg.line().interpolate('basis'))
            .style('stroke', this.colorData[ 'team' + item ])
            .on('mouseover', function (d, i) {
              d3.selectAll('.' + style[ 'team-path' ]).style('opacity', 0.4).style('stroke', 'grey')
              d3.select(this).style('opacity', 1).style('stroke', colorData[ 'team' + item ])
            })
            .on('mouseout', (d, i) => {
              let teams = this.teams
              for (let team in teams) {
                svg.select('#team' + teams[ team ])
                  .style('stroke', colorData[ 'team' + teams[ team ] ])
                  .style('opacity', 0.4)
              }
            })
            .on('click', function (d, i) {
              self.svg.selectAll('.' + self.style[ 'player-path' ]).remove()
              d3.selectAll('.' + style[ 'team-path' ]).style('opacity', 0.4).style('stroke', 'grey')
              d3.select(this).style('opacity', 1).style('stroke', colorData[ 'team' + item ])
              let teamId = d3.select(this).attr('id')
              let teams = Object.keys(self.colorData)
              console.log('-->click-team', teamId, teams.indexOf(teamId))
              self.changeTeamIndex(+teams.indexOf(teamId) + 1, self.colorData[ teamId ])
            })
          let totalLength = path.node().getTotalLength()
          path
            .attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(10000)
            .ease('linear')
            .attr('stroke-dashoffset', 0)
          // .on('click', function (d, i) {
          //
          //
          //   let id = d3.select(this).attr('id')
          //   let color = d3.select(this).style('stroke')
          //   PlayerView.draw(id, color)
          //   TeamInfo.draw(id)
          // });
          itemCount = itemCount + 1
        }
        let yAxis = d3.svg.axis()
          .scale(this.yscale)
          .orient('right')
        let axisElements = svg.append('g')
          .attr('class', style[ 'axis' ])
          .attr('transform', 'translate(' + (this.width - this.margin.right) + ')')
          .call(yAxis)
        let texts = [ '西部常规赛', '西部八强', '西部四强', '西部决赛', '西部冠军', '总冠军', '东部冠军', '东部决赛', '东部四强', '东部八强', '东部常规赛' ]
        axisElements.selectAll('text')
          .text((d) => {
            return texts[ +d ]
          })
        let yscale = this.yscale
        let teams = Object.keys(this.teamYearRankMatrix)
        this.teams = teams
        let brush = d3.svg.brush()
          .y(this.yscale)
          .on('brush', () => {
            for (let team in teams) {
              svg.select('#team' + teams[ team ])
                .style('stroke', this.colorData[ 'team' + teams[ team ] ])
                .style('opacity', 0.4)
            }
            let minExtent = brush.extent()[ 0 ]
            let maxExtent = brush.extent()[ 1 ]
            let s = 0
            let e = 0
            for (let i in d3.range(texts.length - 1)) { // key 检索，默认字符串
              // console.log('==>', yscale(i), minExtent, yscale(+i + 1), minExtent)
              if (yscale(i) < minExtent && yscale(+i + 1) > minExtent) {
                s = +i + 1
              }
              if (yscale(i) < maxExtent && yscale(+i + 1) > maxExtent) {
                e = +i
              }
            }
            this.highLight(this.yStart, this.yEnd, s, e)
          })
        axisElements.append('g')
          .attr('class', style[ 'brush' ])
          .call(brush)
          .selectAll('rect')
          .attr('x', 2)
          .attr('width', this.margin.right - 10)
        for (let i in this.yscale.domain()) {
          svg.append('line')
            .attr('x1', this.margin.left)
            .attr('x2', this.width - this.margin.right)
            .attr('y1', () => {
              return this.yscale(i)
            })
            .attr('y2', () => {
              return this.yscale(i)
            })
            .style('stroke-dasharray', ('3, 3'))
            .style('stroke', 'grey')
        }
      }
    },
    highLight (yStart, yEnd, rStart, rEnd) {
      // d3.selectAll('.' + this.style['team-path']).style('opacity', 0.4).style('stroke', 'grey')
      let selected = 0
      for (let team in this.teamYearRankMatrix) {
        let tag = false
        for (let y = +yStart; y <= +yEnd; y++) {
          if (this.teamYearRankMatrix[ team ][ y ] >= rStart && this.teamYearRankMatrix[ team ][ y ] <= rEnd) {
            tag = true
            break
          }
        }
        if (tag) {
          this.svg.select('#team' + team)
            .style('opacity', 1)
          selected = selected + 1
        } else {
          // console.log(team)
          this.svg.select('#team' + team)
            .style('stroke', 'grey')
            .style('opacity', 0.4)
        }
      }
      if (selected === 0) {
        let teams = this.teams
        for (let team in teams) {
          this.svg.select('#team' + teams[ team ])
            .style('stroke', this.colorData[ 'team' + teams[ team ] ])
            .style('opacity', 0.4)
        }
      }
    }
  },
  ready () {
    this.yStart = 1985
    this.yEnd = 2015
    this.init()
    this.render()
  }
}
