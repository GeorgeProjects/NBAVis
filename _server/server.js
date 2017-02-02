/**
 * Created by huangxinxin on 2017/1/18.
 */
var express = require('express')
var csv2json = require('csv2json')
var fs = require('fs')
var server = express()

// 获取所有球队历年比赛结果, StoryLine视图会请求这个数据
server.get('/get_all_team_records', function (req, res) {
  let allTeamRecords = require('./data/AllTeamsRecords.json')
  res.json(allTeamRecords)
})

// 根据球队id获取球队中球员历年来变动情况
server.get('/get_each_team_records', function (req, res) {
  let teamId = req.query.id
  let eachTeamRecords = require('./data/EachTeamRecords/' + teamId + '.json')
  res.json(eachTeamRecords)
})

// 根据球队id获取球队中球员历年来变动情况
server.get('/get_team_player_exchange', function (req, res) {
  let teamId = req.query.id
  let teamPlayerExchange = require('./data/EachTeamPlayerInfo/' + teamId + '.json')
  res.json(teamPlayerExchange)
})

// 根据球员id获取球员的球队经历, 详细信息, playerIndex, 概括情况
server.get('/get_player_info', function (req, res) {
  let playerId = req.query.id
  console.log('playerId', playerId)
  if(typeof playerId === 'undefined'){
    playerId = 1
  }
  let playerInfo = require('./data/EachPlayerInfo/' + playerId + '.json')
  res.json(playerInfo)
})

// 获取球队的颜色数据, 所有视图中
server.get('/get_team_color', function (req, res) {
  let teamColor = require('./data/TeamColor.json')
  res.json(teamColor)
})

// 获取球队名称与球队index的字典,将球队名称转换成球队的index值
server.get('/get_teamname_index', function (req, res) {
  let teamName2Index = require('./data/TeamName2Index.json')
  res.json(teamName2Index)
})

// 获取东部赛区历年常规赛的成绩
server.get('/get_west_regular_records', function (req, res) {
  let westRegularRecords = require('./data/WestRegularSeason.json')
  res.json(westRegularRecords)
})

// 获取西部赛区历年常规赛成绩
server.get('/get_east_regular_records', function (req, res) {
  let eastRegularRecords = require('./data/EastRegularSeason.json')
  res.json(eastRegularRecords)
})

server.listen(8887, '127.0.0.1', function (err) {
  console.log('Server is running...')
})
