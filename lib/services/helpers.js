exports.objectToArray = function(obj){
	var arr = [];
	for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	        arr.push(obj[key])
	    }
	};
	return arr;
}

exports.isEmptyObject = function(obj) {
  var key;
  if (obj === null) {
    return true;
  }
  if (obj.length && obj.length > 0) {
    return false;
  }
  if (obj.length === 0) {
    return true;
  }
  for (key in obj) {
    if (hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
};

module.exports = exports