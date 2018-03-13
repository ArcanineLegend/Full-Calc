console.log("Don");

var yourCalcsDiv = $("#yourCalcs");

console.log(yourCalcsDiv);

var testArray = ["test1", "test2","test3","test4","test5"];

console.log(testArray);

//gettingUserCalcs(populateButtons)

populateButtons(testArray);
//run query then for each


function populateButtons(givenArray){
    for(var i in givenArray){
       var buttonText = givenArray[i];
       yourCalcsDiv.append("<button type='button'>"+buttonText+"</button>");
       console.log(givenArray);

    }
}










//function populateButtons(data){
//    
//    for(var i in data){
//       var dataElement=data[i];
//       var buttonText=dataElement.tidleName
//       yourCalcsDiv.append("<button type='button' id=yourcalcbutton onclick=''>"+buttonText+"</button>");
//    //    add button destination here
//        
//        
//        
//        
//        yourCalcsDiv.append(<a href="https://arcaninelegend.github.io/Full-Calc/DamageCalculator.html?template=DokkanBattle"><button>Dokkan Calculator</button></a>)
//        
//        
//        
//        
//    }
//}
//
//function loadTemplate() {
//    var templateName = getParameterByName('template');
//    if(!templateName){
//        console.log("No template identified in query params.");
//    }else{
//        console.log("Identified template: "+templateName);
//        loadJson(templateName+".json", function(templateJSON) {
//            // Parse JSON string into object
//            templateData = JSON.parse(templateJSON);
//            console.log("Template version: "+templateData.version);
//            initializePage();
//        });
//    }
//
//}
//
////<button id=logoutbutton onclick="logout()">Logout</button>
//
//
//
//
////Load in the template
//
//function initializePage(){
//	document.title = templateData.title;
//	$(".pageTitle").html("<h1>"+templateData.title+" Damage Calculator</h1>");
//	
//	for (var statGroup in templateData.stuff) {
//		var statGroupObject = templateData.stuff[statGroup];
//		var statGroupHTML = computeStatGroupHTML(statGroupObject);
//		$(".statGroups").append(statGroupHTML);
//	}
//}
