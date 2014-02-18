var assert  = require('assert'),
    expect  = require('expect.js'),
    expectations = require('../lib/expectations')

describe('Expectations', function(){

  describe('#isValid', function(){
    it('passes a valid expectation', function(){
      exp = {
        path: '/users'
      }
      expect(expectations.isValid(exp)).to.be(true)
    })
    it('rejects an invalid expectation', function(){
      exp = {
        body: /firstName/
      }
      expect(expectations.isValid(exp)).to.be(false)
    })

  })

})


