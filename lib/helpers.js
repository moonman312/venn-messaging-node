exports.objectToArray = function(obj){
	var arr = [];
	for (var key in obj) {
	    if (obj.hasOwnProperty(key)) {
	        arr.push(obj[key])
	    }
	};
	return arr;
}

exports.isEmptyObject = function(obj){
    return JSON.stringify(obj) === '{}';
}

module.exports = exports