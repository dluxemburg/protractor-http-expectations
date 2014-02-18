var assert  = require('assert'),
    expect  = require('expect.js'),
    testServer = require('../lib/server'),
    request = require('request'),
    http = require('http')

describe('Test server', function(){

  var app = testServer.createServer()
  var server

  before(function(done){
    server = http.createServer(app).listen(8765,done)
  })

  afterEach(function(done){
    request({
      url: 'http://localhost:8765/__expectations__',
      method: 'DELETE',
      json: true
    }, done)
  })

  describe('POST /__expectations__', function(){
    it('creates an expectation', function(done){

      request({
        url: 'http://localhost:8765/__expectations__',
        method: 'POST',
        json: {path:'/users'}
      }, function(e,r,b){
        expect(b).to.eql([{path:'/users'}])
        expect(b.length).to.eql(1)
        done()
      })

    })

  })

  describe('GET /__expectations__', function(){

    before(function(done){
      request({
        url: 'http://localhost:8765/__expectations__',
        method: 'POST',
        json: {path:'/users'}
      }, function(e,r,b){
        done()
      })
    })

    it('has an expectation', function(done){
      request({
        url: 'http://localhost:8765/__expectations__',
        method: 'GET',
        json: true
      }, function(e,r,b){
        expect(b.length).to.eql(1)
        done()
      })
    })

  })

  after(function(done){
    server.close(done)
  })

})


