/**
 * Created by huangxinxin on 2017/1/18.
 */
let express = require('express')
let csv2json = require('csv2json')
let fs = require('fs')
let server = express()
let teamCompeteInfoJson = require('../assets/data/teaminfo.json')
let teamColor = require('../assets/data/teamcolor.json')

server.get('/api/get_team_compete_info', function (req, res) {
  res.json(teamCompeteInfoJson)
})
server.get('/api/get_team_color', function (req, res) {
  res.json(teamColor)
})
// let populationJson = require('./data/population.json')

// let populationData = null;
// fs.createReadStream('./data/population.csv')
//   .pipe(csv2json({
//     separator: ','
//   }))
//   .pipe(fs.createWriteStream('./data/population.json'));
// server.get('/get_population', function (req, res) {
//   res.json(populationJson)
// })
server.listen(8887, '127.0.0.1', function (err) {
  console.log('Server is running...')
})

