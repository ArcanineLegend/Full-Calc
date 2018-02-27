var templateData;

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function loadJson(file, callback){
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
	xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            callback(xhr.responseText);
        }
    }
    xhr.open('GET', file, true);
    xhr.send();
}

//Load in the template
var templateName = getParameterByName('template');
if(!templateName){
	console.log("No template identified in query params.");
}else{
	console.log("Identified template: "+templateName);
	loadJson(templateName+".json", function(templateJSON) {
		// Parse JSON string into object
		templateData = JSON.parse(templateJSON);
		console.log("Template version: "+templateData.version);
		initializePage();
	});
}

function initializePage(){
	document.title = templateData.title;
	$(".pageTitle").html("<h1>"+templateData.title+" Damage Calculator</h1>");
	
	for (var statGroup in templateData.stuff) {
		var statGroupObject = templateData.stuff[statGroup];
		var statGroupHTML = computeStatGroupHTML(statGroupObject);
		$(".statGroups").append(statGroupHTML);
	}
}

function computeStatGroupHTML(statGroupObject){
	var htmlString = '<fieldset>';
	htmlString += '<legend> <b> '+statGroupObject.friendlyName+' </b>:</legend>';

	for (var dataItem in statGroupObject.data) {
		var dataItemObject = statGroupObject.data[dataItem];
		var value = dataItemObject.value == null ? 0 : dataItemObject.value;
		htmlString += '<p>'+dataItemObject.description+':<input type="number" id="'+dataItem+'" value="'+value+'"/></p>';
	}
	return htmlString;
}
