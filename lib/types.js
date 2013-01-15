module.exports = function(type, value) {
	if (type === 'list') {
		var result = [].splice.call(value, 0);
		break;
	} else {
		var result = {value:value}
		break;
	}
	result.type = type;
	return result;
}