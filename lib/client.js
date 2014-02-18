var request = require('request')

var Client = exports.Client = function(options){
  this.options = options
}

Client.prototype.baseAddress = function(){
  return 'http://localhost:'+(this.options.port || 9876)
}

Client.prototype.addExpectation = function(expectation,fn){
  request({
    url: this.baseAddress()+'/__expectations__',
    method: 'POST',
    json: expectation
  }, function(e,r,b){ fn(e,b) })
}

Client.prototype.getOutstanding = function(fn){
  request({
    url: this.baseAddress()+'/__outstanding__',
    method: 'GET',
    json: true
  }, function(e,r,b){ fn(e,b) })
}

Client.prototype.getUnexpected = function(fn){
  request({
    url: this.baseAddress()+'/__unexpected__',
    method: 'GET',
    json: true
  }, function(e,r,b){ fn(e,b) })
}

Client.prototype.clear = function(fn){
  request({
    url: this.baseAddress()+'/__expectations__',
    method: 'DELETE',
    json: true
  }, function(e,r,b){ fn(e,b) })
}


exports.createClient = function(options){
  return new Client(options)
}