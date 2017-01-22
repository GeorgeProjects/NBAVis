/**
 * Created by huangxinxin on 2017/1/18.
 */
var express = require('express')
// var csv2json = require('csv2json')
var fs = require('fs')
var server = express()
// var aqiBeijingJson = require('./data/aqi-beijing.json')
var teamInfo = require('../src/apps/Index/PlayerChangements/team.json')
// var populationJson = require('./data/population.json')

// var populationData = null;
// fs.createReadStream('./data/population.csv')
//   .pipe(csv2json({
//     separator: ','
//   }))
//   .pipe(fs.createWriteStream('./data/population.json'));
/* server.get('/api/get_aqi_beijing', function (req, res) {
  res.json(aqiBeijingJson)
}) */
// server.get('/get_population', function (req, res) {
//   res.json(populationJson)
// })
server.get('/api/get_team_info', function (req, res) {
  res.json(teamInfo)
})
server.listen(8887, '127.0.0.1', function (err) {
  console.log('Server is running...')
})


