//Look here for help setting up Cognito: https://docs.aws.amazon.com/cognito/latest/developerguide/using-amazon-cognito-user-identity-pools-javascript-examples.html
console.log("Starting to execute the script file...");

if(!$){
	console.log("jQuery is NOT loaded properly");
}else{
	console.log("jQuery is good to use");
}

if(!window.AWS){
	console.log("Amazon Basic SDK is NOT loaded properly");
}else{
	console.log("Amazon Basic SDK is good to use");
}

if(!!window.AWSCognito && !!window.AmazonCognitoIdentity){
	console.log("Amazon Cognito SDK is good to use");
}else{
	console.log("Amazon Cognito SDK is NOT loaded properly");
}

// Config for Amazon Cognito service specifically.
AWSCognito.config.region = 'us-east-1';
var poolData = {
    UserPoolId : 'us-east-1_VmYAu5V3z', // your user pool id here pro240pool
    ClientId : '4g0cno5sua5do9lc4g0nkp7pg0' // your app client id here pro240client
};
var userPool = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
var cognitoUser;
var isAdmin;

function createAccount(){
	console.log("executing createAccount()...");
	
	console.log($(".createAccountDiv"));
	
	var dataObj = {
        email: document.getElementById("formEM").value,
		usern: document.getElementById("formUN").value,
		passw: document.getElementById("formPW").value
	};
	
    var attributeList = [];
    var dataEmail = {
        Name : 'email',
        Value : dataObj.email
    };
    
	console.log("Retrieved this username from the form: "+dataObj.usern);
	console.log("Retrieved this password from the form: "+dataObj.passw);
	
    var attributeEmail = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    
    userPool.signUp(dataObj.usern, dataObj.passw, attributeList, null, onSignUpResult);
	
    console.log('End of createAccount function');
};

function logout(){
	console.log("executing logout()...");
    if(cognitoUser != null) {
        cognitoUser.signOut();
    }
    window.location.href = "index.html";
    console.log('End of logout function');
};

function showLibrary(){
	console.log("executing showSignInView()...");
	window.location.href = "DamageCalculator.html";
    console.log('End of showSignInView() function');
}

function showNotLoggedInView(){
	console.log("executing showNotLoggedInView()...");
	 window.location.href = "index.html";
    console.log('End of showNotLoggedInView function');
}

function showLoggedInView(){
	console.log("executing showLoggedInView()...");
	window.location.href = "dashboard.html";
    	console.log('End of showLoggedInView function');
    
}

function onSignUpResult(err, result){
	if (err) {
		console.log('Sign up failure: '+err);
		alert(err);
		return;
	}
	console.log('Sign up success: '+JSON.stringify(session));
	cognitoUser = session.user;
	console.log('user name is ' + cognitoUser.getUsername());
	showLoggedInView();
}



// Config for a service user who has roles to access Lambda, S3 and other services included in Amazon's basic SDK.
var accessKeyId = 'putyouraccessidhere';
var secretAccessKey = 'putyoursecretaccesskeyhere';

AWS.config.update({
	region: 'us-east-2',
	credentials: new AWS.Credentials(accessKeyId, secretAccessKey)
});
/// Prepare to call Lambda function
lambda = new AWS.Lambda({region: 'us-east-1', apiVersion: '2015-03-31'});
var params = {
	FunctionName : 'arn:putyourlambdaarnhere',
	InvocationType : 'RequestResponse',
	LogType : 'None'
};

function callLambdaFunctionOnAws() {
	lambda.invoke(params, function(err, data) {
		if (err) {
			prompt(err);
		} else {
			pullResults = JSON.parse(data.Payload);
			var t = document.createTextNode(pullResults);
			document.body.appendChild(t);
		}
	});
};


function performLogin(){
	var usernameToLogin = document.getElementById("loginUsername").value;
	var passwordToLogin = document.getElementById("loginPassword").value;
	
	console.log("Retrieved this username from the login form: "+usernameToLogin);
	console.log("Retrieved this password from the login form: "+passwordToLogin);
    
    var authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails({
		Username : usernameToLogin,
        Password : passwordToLogin
	});
    var userData = {
        Username : usernameToLogin,
        Pool : userPool
    };
    var cognitoUserToLogin = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUserToLogin.authenticateUser(authenticationDetails, {
        onSuccess: function(session) {
            cognitoUser = cognitoUserToLogin;
            onSuccessfulLogin(session);
        },
        
        onFailure: function(err) {
            alert(err);
        },
		
		newPasswordRequired: function(obj){
			alert("new password required: "+JSON.stringify(obj));
		},
 
    });
}

function onSuccessfulLogin(session) {
	console.log("You are successfully logged in.");
    	initiateApp(session);
    	showLoggedInView();
	//console.log('access token + ' + result.getAccessToken().getJwtToken());
    /*Use the idToken for Logins Map when Federating User Pools with Cognito Identity or when passing through an Authorization Header to an API Gateway Authorizer*/
    //console.log('idToken + ' + result.idToken.jwtToken);
}

function determineAdminStatus(session) {
    var cognitoGroups = session.accessToken.payload["cognito:groups"];
    for (var group in cognitoGroups) {
        if (cognitoGroups[group] == "Administrators") {
            isAdmin = true;
            break;
        }
    }
    if (isAdmin) {
        for (var i in document.styleSheets) {
            var myStyleSheet = document.styleSheets[i];
            for (var j in myStyleSheet.cssRules) {
                var CSSStyleRule = myStyleSheet.cssRules[j];
                if (CSSStyleRule.selectorText == ".admin") {
                    CSSStyleRule.style.cssText = "";
                    break;
                }
            }
        }
    }
}

function initiateApp(session){
	if (cognitoUser.getUsername() == null || "") {
		$("#usernameDiv").html("Guest");
	} else {
    		$("#usernameDiv").html(cognitoUser.getUsername());
	}
    determineAdminStatus(session);
}

function checkForSignedInUser() {
    cognitoUser = userPool.getCurrentUser();
    if (cognitoUser == null) {
        console.log("No session found in browser storage");
    } else {
        console.log("A user session was found in browser storage: "+JSON.stringify(cognitoUser));
        cognitoUser.getSession(function(err, session) {
            if (err) {
                console.log("Even though user sesssion was found in browser storage, the session is invalid.");
                return;
            }
            initiateApp(session);
        });
    }
}

checkForSignedInUser();

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function computedamage() {
        //Gets user input
        var baseAtk = Number(document.getElementById("baseAtk").value);
        var potBoost = Number(document.getElementById("potBoost").value);
		var saBoost = Number(document.getElementById("saBoost").value);
	
        var leader1 = Number(document.getElementById("leader1").value)/100;
		var leader2 = Number(document.getElementById("leader2").value)/100;
	
        var fullKI = Number(document.getElementById("fullKI").value)/100;
		var saAtk = Number(document.getElementById("saAtk").value)/100;
	
        var startPerc = Number(document.getElementById("startPerc").value)/100;
		var startFlat = Number(document.getElementById("startFlat").value);
	
        var fStartPerc = Number(document.getElementById("fStartPerc").value)/100;
		var fStartFlat = Number(document.getElementById("fStartFlat").value);
	
        var linkPerc = Number(document.getElementById("linkPerc").value)/100;
		var linkFlat = Number(document.getElementById("linkFlat").value);
		var endPerc = Number(document.getElementById("endPerc").value)/100;
		var endFlat = Number(document.getElementById("endFlat").value);
		var saAtkBoost = Number(document.getElementById("saAtkBoost").value)/100;
		var saAtkBoostFlat = Number(document.getElementById("saAtkBoostFlat").value);
		
        //Equations required to calculate damage
        var combinedAtk = baseAtk + potBoost;
		var leaderAtk = Math.floor(combinedAtk*(1 + leader1 + leader2));
		var atkWithPass = Math.floor(startFlat + fStartFlat + leaderAtk*(1 + startPerc + fStartPerc));
		var linkedAtk = Math.floor(atkWithPass*(1+linkPerc) + linkFlat);
		var fullKIAtk = Math.ceil(fullKI*(linkedAtk + endFlat));
		var fullKIAtk2 = Math.floor(fullKIAtk*(1+saAtkBoost) + saAtkBoostFlat);
		var superBoost = saAtk + 0.05*saBoost + endPerc;
		var totalDamage = Math.floor(fullKIAtk2*superBoost);

        //Display the result
        document.getElementById("output1").innerText = totalDamage;
	document.getElementById("output2").innerText = fullKIAtk;
    }

jQuery(function($) {
  var fbTemplate = document.getElementById('build-wrap');
  $(fbTemplate).formBuilder();
});
