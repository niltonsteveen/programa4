var express = require('express');
var fileManagement = require('./business/file_management');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

app.set('port', (process.env.PORT || 5021));

app.use(express.static(__dirname + '/public'));
app.use(fileUpload());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
 	response.render('pages/index');
});

app.post('/', function(request, response) {
	if (!request.files){
		return response.status(400).send('No files were uploaded.');	
	}
	var fileInput=request.files.fileUInput;
	var fileData=fileInput.data;
	if ((fileInput.name).indexOf(".csv")<0){
		return response.status(400).send('Extension file is not allowed');	
	}else{
		var csv=fileData.toString();
		var lines=csv.split(/\r\n|\n|\r/);
		var headers = lines[0].split(";");
		var result = fileManagement.fileToObject(lines, headers);		
		var keysHeaders = Object.keys(result[0]);
		var values=fileManagement.getBaseNumbers(headers, result);
		var summary=fileManagement.summaryValue(values);		
		var avg = summary/values.length;
		var varianceSum=fileManagement.varianceValue(avg, values);
		var variance=varianceSum/(values.length - 1);
		var lnxi=fileManagement.getLnXi(avg, values);
		var lnxiAvg=fileManagement.getlnxiAvg(avg, values);
		var deviation = Math.sqrt(variance);
		var lnVS=avg - (2 * deviation);
		var lnS=avg - deviation;
		var lnM=avg;
		var lnL=avg+deviation;
		var lnVL=avg+(2*deviation);
		var VS=Math.pow(Math.E, lnVS);
		var S=Math.pow(Math.E, lnS);
		var M=Math.pow(Math.E, lnM);
		var L=Math.pow(Math.E, lnL);
		var VL=Math.pow(Math.E, lnVL);
		for (var i = 0; i < result.length ; i++) {
			result[i]['lnxi']=lnxi[i];
			result[i]['lnxiAvg']=lnxiAvg[i];
			result[i]['loc-method']=values[i];
		}
		keysHeaders.push("Any Method");
		keysHeaders.push("Ln(Xi)");
		keysHeaders.push("(Ln(Xi)-avg)^2");

		console.log(result);
		return response.render('pages/table', {
        	headers: keysHeaders,
        	results: result,
        	summary: summary,
        	varianceSum: varianceSum,
        	VS:VS,
        	S:S,
        	M:M,
        	L:L,
        	VL:VL
    	});
	}
 	
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
