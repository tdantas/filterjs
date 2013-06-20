function Filter(data, map){
  this.data = data
  this.typeMapper = buildMapper(map)
}

function buildMapper(map){
  var keys = Object.keys(map)
  var mapper = {}
  keys.forEach(function(key) {
    mapper[key] = Filter.FilterMapper[map[key]] 
  });
  return mapper 
}

function validKeys(_keys, validKeys){
  var result = true;
  _keys.forEach(function(item){
    if(validKeys.indexOf(item) < 0 ) {
      console.log("Invalid Key: " + item )
      result = false;
    }
      
  });
  return result
}

Filter.prototype.results = function(criteria) {
  if(! validKeys(Object.keys(criteria), Object.keys(this.typeMapper)))
    throw "Key not mapped"

  var filtered = []
  var keys = Object.keys(criteria)
  var self = this
  
  this.data.forEach(function(data){
    var againstMatcher = keys.map(function(key) {
      return self.typeMapper[key](data, criteria[key], key)
    })
    
    var valid = againstMatcher.reduce(function(acc, current ){
      return acc && current
    },true)
     
    if(valid) {
      filtered.push(data)
    }
  })

  return filtered
}

function StringCriteria(item, criteria, key){
  var operators = Object.keys(criteria)
  var matches = operators.map(function(opkey) {
    return stringOperators(opkey)(item[key],criteria[opkey])  
  })
 
  return matches.reduce(function(acc, current){
    return acc && current
  }, true)

}

function stringOperators(operator){
  var operatorHash = { eq: StringMatch , contains: StringMatch }
  function nop(itemValue, term) { return false }
  return operatorHash[operator] || nop
}

function StringMatch(itemValue, term) {
  var re = new RegExp(term, 'i')
  return re.test(itemValue)
}


function NumberCriteria(item, criteria, key){
  var operators = Object.keys(criteria)
  var matches = operators.map(function(opkey){
    return numberOperator(opkey)(item[key],criteria[opkey])  
  })

  return matches.reduce(function(acc, current){
    return acc && current
  }, true)
}

function numberOperator(operator){
  var operatorHash = { gte: NumberGreaterThanEqual }
  function nop(){ return false}
  return operatorHash[operator] || nop
}

function NumberGreaterThanEqual(itemValue, term){
  return itemValue >= term
}

Filter.STRING = 'STRING'
Filter.NUMBER = 'NUMBER'
Filter.FilterMapper = {}
Filter.FilterMapper[Filter.STRING] = StringCriteria
Filter.FilterMapper[Filter.NUMBER] = NumberCriteria



