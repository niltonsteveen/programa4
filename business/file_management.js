var fs = require('fs');

function fileToObject(lines, headers) {
	var result = [];		
	for(var i=1;i<lines.length;i++){
		var obj = {};
		var currentline=lines[i].split(";");
		for(var j=0;j<headers.length;j++){
			obj[headers[j]] = currentline[j];
		}
		result.push(obj);
	}
	return result
}

function getBaseNumbers(headers, result){
	var values=[]
	if (headers.length == 1) {
		for (var i = 0; i < result.length; i++) {
			values.push(parseInt(result[i][headers[0]]));
		}
	}else if(headers.length == 2){
		if(typeof(result[0][headers[0]])=='string'){
			for (var i = 0; i < result.length; i++) {
				values.push(parseInt(result[i][headers[1]]));
			}
		}else{
			for (var i = 0; i < result.length; i++) {
				let divide = parseInt(result[i][headers[0]])/parseInt(result[i][headers[1]]);
				values.push(divide);
			}
		}
	}else{
		for (var i = 0; i < result.length; i++) {
			let divide = parseInt(result[i][headers[1]])/parseInt(result[i][headers[2]]);
			values.push(divide);
		}
	}
	return values;
}

function summaryValue(values) {
	var summary = 0;
	for (var i = 0; i < values.length ; i++) {
		summary = summary + Math.log(values[i]);
	}

	return summary;
}

function getLnXi(avg, values) {
	var arrayLnXi = [];
	for (var i = 0; i < values.length ; i++) {
		arrayLnXi.push(Math.log(values[i]));
	}

	return arrayLnXi;
}

function getlnxiAvg(avg, values) {
	var lnxiAvg = [];
	for (var i = 0; i < values.length ; i++) {
		lnxiAvg.push(Math.pow(Math.log(values[i])-avg,2));
	}

	return lnxiAvg;
}

function varianceValue(avg, values) {
	var variance = 0;
	for (var i = 0; i < values.length ; i++) {
		variance = variance + (Math.pow(Math.log(values[i])-avg,2));
	}
	return variance;
}

module.exports={
	fileToObject:fileToObject,
	summaryValue:summaryValue,
	varianceValue:varianceValue,
	getlnxiAvg:getlnxiAvg,
	getLnXi:getLnXi,
	getBaseNumbers:getBaseNumbers
};