import style from './style.less'
import template from './template.html'
import d3 from 'd3'
export default{
  template,
  props: ['teamCompeteInfo', 'teamColor'],
  data () {
    return {
      style,
      elId: `storyline-${(+new Date())}-${Math.random() * 100 * 1000 * 1000}`
    }
  },
  watch: {
    teamCompeteInfo () {
      this.render()
    }
  },
  methods: {
    init () {
      this.width = this.$el.clientWidth
      this.height = this.$el.clientHeight
      this.svg = d3.select('#story-line-svg')
        .attr('width', this.width)
        .attr('height', this.height)
      this.margin = {left: 10, right: 75, top: 10, bottom: 10}
      this.yscale = d3.scale.ordinal()
        .domain(d3.range(11))
        .rangePoints([0, this.height], 0.6) // 空白处所占的比例
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
      let project = {'0': 0, '1': 1, '2': 2, '4': 3, '8': 4, '16': 5}
      let top = 0
      let left = 0
      let sbias = 2.5
      let bias = 0
      let vbias = 0
      let ysquence = sequences[eastOrWest][year]
      let sNum = project[best]
      if (sNum === 1) {
        vbias = this.levelHeight * 2.3
      } else if (sNum === 2) {
        vbias = this.levelHeight * 2.3
      } else if (sNum === 3) {
        vbias = this.levelHeight * 2
        let index = ysquence[sNum].indexOf(team)
        if (index === 0) {
          bias = -sbias
        } else bias = sbias
      } else if (sNum === 4) {
        let index = ysquence[sNum].indexOf(team)
        bias = (index - 2) * sbias * 2 + sbias / 2 + 1
      }
      if (eastOrWest === 'east') {
        let leftNum = year - 1985
        left = leftNum * (this.timeWidth + this.timeGapWidth)
        let topNum = +eastTransformObj[best]
        // top = topNum * (this.levelHeight + this.levelGapHeight) + bias
        top = this.yscale(topNum) + bias
      } else if (eastOrWest === 'west') {
        let leftNum = year - 1985
        left = leftNum * (this.timeWidth + this.timeGapWidth)
        let topNum = +westTransformObj[best]
        // top = topNum * (this.levelHeight + this.levelGapHeight) - bias + vbias - vbias
        top = this.yscale(topNum) - bias + vbias - vbias
      }
      locationArray.push(left + this.margin.left)
      locationArray.push(top)
      return locationArray
    },
    adjust (data, start, step) {
      function exchange (team1, team2, arr) {
        let index1 = 100
        let index2 = 100
        for (let i = 0; i < 5; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === team1) {
              index1 = i * 10 + j
            }
            if (arr[i][j] === team2) {
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
        if (step < 0 && year <= 1985) {
          break
        }
        if (step > 0 && year >= 2015) {
          break
        }
        let arr1 = data[year]
        let arr2 = data[year + step]
        if (exchange(arr2[3][0], arr2[3][1], arr1)) {
          let tmp = arr2[3][0]
          arr2[3][0] = arr2[3][1]
          arr2[3][1] = tmp
        }
        for (let i = 0; i < 4; i++) {
          for (let j = i + 1; j < 4; j++) {
            if (exchange(arr2[4][i], arr2[4][j], arr1)) {
              let tmp = arr2[4][i]
              arr2[4][i] = arr2[4][j]
              arr2[4][j] = tmp
            }
          }
        }
        year = year + step
      }
    },
    computeSequences (data) {
      let yearIndexTeam = {} // [ west ]: year: [0]-冠军, [1]-地区冠军, [2]-决赛, [3]-四强, [4]-八强
      yearIndexTeam['west'] = {}
      yearIndexTeam['east'] = {}
      for (let year = 1985; year <= 2015; year++) {
        yearIndexTeam['west'][year] = {}
        yearIndexTeam['east'][year] = {}
        for (let i = 0; i < 5; i++) {
          yearIndexTeam['west'][year][i] = []
          yearIndexTeam['east'][year][i] = []
        }
      }
      let project = {'0': 0, '1': 1, '2': 2, '4': 3, '8': 4}
      // console.log(data)
      for (let team in data) {
        for (let year in data[team]) {
          // console.log(data[team][year].best)
          let best = project[data[team][year].best]
          let loc = data[team][year].loc
          // console.log('=>', best)
          // console.log('year=>', yearIndexTeam)
          yearIndexTeam[loc][year][best].push(team)
        }
      }
      // 顺序调整，两个方向1985-2015， 2015-1985
      this.adjust(yearIndexTeam['west'], 1985, 1)
      this.adjust(yearIndexTeam['west'], 2015, -1)
      this.adjust(yearIndexTeam['east'], 1985, 1)
      this.adjust(yearIndexTeam['east'], 2015, -1)
      return yearIndexTeam
    },
    render () {
      if (this.teamCompeteInfo && this.teamColor) {
        // console.log(this.teamCompeteInfo)
        // 必须先判断一下
        let timeLen = 31
        let timeGapLen = 30
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
        console.log(sequences)
        let itemCount = 0
        let svg = this.svg
        for (let item in data.teaminfo) {
          matchResultArray[itemCount] = {}
          matchResultArray[itemCount].team_name = item
          matchResultArray[itemCount].match_result = []
          for (let i = 0; i < timeLen; i++) {
            let year = 1985 + i
            let attrNameArrray = Object.keys(data.teaminfo[item])
            let loc = data.teaminfo[item][attrNameArrray[0]].loc
            let best = 0
            if (data.teaminfo[item][year] === undefined) {
              best = 16
            } else {
              best = data.teaminfo[item][year].best
            }
            let locationArray = this.computeLocations(loc, best, year, item, sequences)
            matchResultArray[itemCount].match_result.push(locationArray)
          }
          let matchResultArrayAdded = []
          let lastX = 0
          let lastY = 0
          for (let i = 0; i < timeLen - 1; i++) {
            let zero = matchResultArray[itemCount].match_result[i]
            let zeroX = zero[0]
            let zeroY = zero[1]
            let firstX = zeroX + this.timeWidth
            let firstY = zeroY
            let forth = matchResultArray[itemCount].match_result[i + 1]
            let forthX = forth[0]
            let forthY = forth[1]
            let secondX = (firstX + forthX) / 2
            let secondY = firstY
            let thirdX = (firstX + forthX) / 2
            let thirdY = forthY
            matchResultArrayAdded.push([zeroX, zeroY])
            matchResultArrayAdded.push([firstX, firstY])
            matchResultArrayAdded.push([secondX, secondY])
            matchResultArrayAdded.push([thirdX, thirdY])
            matchResultArrayAdded.push([forthX, forthY])
            lastX = forth[0]
            lastY = forth[1]
          }
          matchResultArrayAdded.push([lastX + this.timeWidth, lastY])
          let colorData = this.teamColor
          let style = this.style
          let path = svg.append('path')
            .attr('class', (d, i) => {
              return this.style['team-path']
            })
            .attr('id', item)
            .data([matchResultArrayAdded])
            .attr('d', d3.svg.line().interpolate('basis'))
            .style('stroke', function () {
              let colorString = colorData.teamcolor[item].replace(' ', '')
              let colorArray = colorString.split(',')
              // console.log(colorArray)
              return 'rgb(' + colorArray[0] + ',' + colorArray[1] + ',' + colorArray[2] + ')'
            })
            .on('mouseover', function (d, i) {
              d3.selectAll('.' + style['team-path']).style('opacity', 0.4)
              d3.select(this).style('opacity', 1)
              // console.log(d3.select(this).attr('id'))
              // let state = d3.select(this).attr('class').replace('projection-node-path ', '');
              // d3.selectAll('.projection-node-path').classed('not-hover', true);
              // d3.select(this).classed('not-hover', false);
              // d3.select(this).classed('hover', true);
              // self.hover_highlightState(state);
            })
            .on('mouseout', function (d, i) {
              d3.select(this).style('opacity', 0.4)
              // let state = d3.select(this).attr('class').replace('projection-node-path ', '');
              // d3.selectAll('.projection-node-path').classed('not-hover', false);
              // d3.select(this).classed('not-hover', false);
              // d3.select(this).classed('hover', false);
            })
            .on('click', function (d, i) {
              console.log(d3.select(this).attr('id'))
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
          .attr('class', style['axis'])
          .attr('transform', 'translate(' + (this.width - this.margin.right - this.timeWidth) + ')')
          .call(yAxis)
        let texts = ['西部常规赛', '西部八强', '西部四强', '西部决赛', '西部冠军', '总冠军', '东部冠军', '东部决赛', '东部四强', '东部八强', '东部常规赛']
        axisElements.selectAll('text')
          .text((d) => {
            return texts[+d]
          })
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
    }
  },
  ready () {
    this.init()
    this.render()
  }
}
