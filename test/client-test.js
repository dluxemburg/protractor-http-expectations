var assert  = require('assert'),
    expect  = require('expect.js'),
    testServer = require('../lib/server'),
    testClient = require('../lib/client'),
    request = require('request'),
    http = require('http')

describe('Test client', function(){

  var app = testServer.createServer()
  var client = testClient.createClient({port: 9876})
  var server

  before(function(done){
    server = http.createServer(app).listen(9876,done)
  })

  afterEach(function(done){
    client.clear(done)
  })

  describe('#addExpectation and fulfill it', function(){
    it('returns the assigned payload and not outstanding or unexpected', function(done){
      client.addExpectation({
        path: '/users',
        method: 'get',
        respond: [{name:'Dan'}]
      },function(){
        request({
          url: 'http://localhost:9876/users',
          method: 'GET',
          json: true
        }, function(e,r,b){
          expect(b).to.eql([{name: 'Dan'}])
          client.getOutstanding(function(err,outstanding){
            expect(outstanding.length).to.eql(0)
            client.getUnexpected(function(err,unexpected){
              expect(unexpected.length).to.eql(0)
              done()
            })
          })
        })
      })
    })
  })

  describe('#addExpectation and do not fulfill it', function(){
    it('returns an outstanding expectation', function(done){
      client.addExpectation({
        path: '/users',
        method: 'get',
        respond: [{name:'Dan'}]
      },function(){
        client.getOutstanding(function(err,outstanding){
          expect(outstanding.length).to.eql(1)
          client.getUnexpected(function(err,unexpected){
            expect(unexpected.length).to.eql(0)
            done()
          })
        })
      })
    })
  })

  describe('#addExpectation and send a different request', function(){
    it('returns an outstanding expectation and an unexpected request', function(done){
      client.addExpectation({
        path: '/users',
        method: 'get',
        respond: [{name:'Dan'}]
      },function(){
        request({
          url: 'http://localhost:9876/friends',
          method: 'GET',
          json: true
        }, function(e,r,b){
          expect(b).to.not.eql([{name: 'Dan'}])
          client.getOutstanding(function(err,outstanding){
            expect(outstanding.length).to.eql(1)
            client.getUnexpected(function(err,unexpected){
              expect(unexpected.length).to.eql(1)
              done()
            })
          })
        })
      })
    })
  })

  after(function(done){
    server.close(done)
  })

})


