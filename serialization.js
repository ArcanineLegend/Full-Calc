function dynamoDataToJson(dynamoData){
return JSON.parse(dynamo.data);
}

function templateJsonToDynamoStructure(templateJson){
var dynamoJson = {
TableName: "TemplateDB",
Item:{
"Username": {
"S": "ArcanineJeff"
},
"TemplateTitle": {
"S": "Jeff Dokkan"
},
"Description":{
"S": null
},
"Data":{
"S": JSON.stringify(templateJson)
}
}
};
  return dynamoJson;
}
