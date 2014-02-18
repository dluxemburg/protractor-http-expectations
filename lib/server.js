var express = require('express'),
    expectationsMatcher = require('./expectations')

exports.createServer = function(){

  var expectations = []
  var unexpected = []

  var outstanding = function(){
    return expectations.filter(function(e){
      return !e.complete
    })
  }

  var app = express()

  app.use(express.urlencoded())
  app.use(express.json())
  app.use(express.query())

  app.post('/__expectations__', function(req,res){
    expectations.push(req.body)
    res.json(expectations)
  })

  app.get('/__expectations__', function(req,res){
    res.json(expectations)
  })

  app.del('/__expectations__', function(req,res){
    expectations = []
    unexpected = []
    res.json(expectations)
  })

  app.get('/__outstanding__', function(req,res){
    res.json(outstanding())
  })

  app.get('/__unexpected__', function(req,res){
    res.json(unexpected)
  })

  app.all('*', function(req,res){
    expectationsMatcher.match(expectations,req,function(exps,unexp,response){
      expectations = exps
      if(unexp) unexpected.push(unexp)
      res.json(response || '')
    })
  })

  return app


}