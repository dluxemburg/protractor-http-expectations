exports.isValid = function(expectation){
  if(!expectation.path) return false
  return true
}

var isMatch = exports.isMatch = function(exp, req){
  return exp.path == req.path
}

exports.match = function(expectations,req,fn){
  var response, unexp
  expectations.forEach(function(e, index){
    e._index = index
  })
  var matches = expectations.filter(function(e){
    return isMatch(e,req)
  })
  if(matches.length > 0){
    expectations[matches[0]._index].complete = true
    response = matches[0].respond
  } else {
    unexp = {
      path: req.path
    }
  }
  expectations.forEach(function(e){
    delete(e._index)
  })

  fn(expectations,unexp,response)

}