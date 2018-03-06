function dynamoDataToJson(dynamoData){
return JSON.parse(dynamo.data);
}

function templateJsonToDynamoStructure(templateJson){
return {
TableName: "TemplateDB",
Item:{
"Username": {
"S": "ArcanineJeff"
},
"TemplateTitle": {
"S": "Jeff Dokkan"
},
"description":{
"S": null
},
"data":{
"S": JSON.stringify(templateJson)
},
}
}
}​
