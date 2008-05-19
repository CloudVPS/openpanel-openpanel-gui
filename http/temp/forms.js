/**
 * @author jp
 */
/*
 * text
 * ip
 * number
 * password
 * textarea
 * editor
 * grid ?
 * hidden
 * 
 * 
 */
	
var OpenPanel = {}
OpenPanel.GUIBuilder = {}
var dummyData = {
	
	first: {
		name: "first",
		label: "adresadresadresadresadresadresadres",
		type: "TextField"
	},
	
	second: {
		name: "second",
		label: "huisnummer",
		type: "TextField",
		sameline: true,
		showLabel: true,
	},
	
	secondBis: {
		name: "second",
		label: "huisnummer",
		type: "TextField",
		sameline: true
	},
	
	third: {
		name: "third",
		label: "Third Var",
		type: "Number"
	},
	
	fourth: {
		name: "fourth",
		label: "Fourth Var",
		type: "IPAddress"
	},
	
	fourthBis: {
		name: "fourthBis",
		label: "Fourth Var * needed",
		type: "IPAddress",
		needed: true
	},
	
	fifth: {
		name: "fifth",
		label: "fifth Var",
		type: "TextField"
	},
	
	sixth: {
		name: "sixth",
		label: "sixth Var",
		type: "TextField"
	},
	
	eigth: {
		name: "eigth",
		label: "eigth Var",
		type: "TextField"
	},
	
	nineth: {
		name: "nineth",
		label: "nineth Var",
		type: "TextField"
	},
	
	tenth: {
		name: "tenth",
		label: "tenth Var",
		type: "TextField"
	},
	
	eleventh: {
		name: "nineth",
		label: "Fourth Var",
		type: "TextField"
	},
	
	twelveth: {
		name: "twelveth",
		label: "twelveth Var",
		type: "TextField"
	},
	
	thirteenth: {
		name: "thirteenth",
		label: "thirteenth Var",
		type: "TextField"
	}
}

var dummyValues = {
	
	first: 100,
	second: 200,
	secondBis: 250,
	third: 350,
	fourthBis: "192.168.1",
	fifth: 500,
	sixth: 550,
	eigth: 650,
	nineth: 500,
	tenth: 450,
	eleventh: 400,
	twelveth: 350,
	thirteenth: 200
}

function build(){
	var rootElement = document.getElementById("t");
	var tableElement = document.createElement("table");
	tableElement.setAttribute("class", "formTable");
	tableElement.setAttribute("cellspacing", "0");
	tableElement.setAttribute("cellpadding", "0");
	rootElement.appendChild(tableElement);
	var tbodyElement = document.createElement("tbody");
	tableElement.appendChild(tbodyElement);
	var trElement = document.createElement("tr");
	tbodyElement.appendChild(trElement);
	
	var paramArray = new Array();
	var rows = 0;
	for (var paramName in dummyData) {
		var parameter = dummyData[paramName];
		if (parameter.sameline == undefined || parameter.sameline != true) {
			rows++;
		}
		paramArray.push(dummyData[paramName]);
	}
	
	var maxRows = Math.ceil(rows/2);
	
	var i = 0;
	var rows = 0;
	for(var paramName in dummyData){
		var parameter = dummyData[paramName];
		var f = new OpenPanel.GUIBuilder.Widget.createWidget(parameter);
		
		f.init();
		f.build();
		f.setValue(dummyValues[paramName]);
		
		var e = f.getElement();
		var formElementLabel = f.formElementLabel;
		var fieldElementContainer = f.fieldElementContainer;
		console.log(fieldElementContainer);
		var fieldElement = f.fieldElement;
		
		if(rows == 0 || rows == maxRows){
			var columnElement = document.createElement("td");
			columnElement.setAttribute("class", "formColumn");
			trElement.appendChild(columnElement);
			var innerTable = document.createElement("table");
			
			columnElement.appendChild(innerTable);
			var innerTbody = document.createElement("tbody");
			innerTable.appendChild(innerTbody);
			
			rows = 0;
		}
		
		if(parameter.sameline == true){
			if(parameter.showLabel != undefined && parameter.showLabel == true){
				rowRightElement.appendChild(formElementLabel);
			}
			rowRightElement.appendChild(fieldElementContainer);
		} else {
			var innerTr = document.createElement("tr");
			innerTbody.appendChild(innerTr);
			var rowElement = document.createElement("td");
			
			var rowLeftElement = document.createElement("td");
			rowLeftElement.setAttribute("class", "rowLeftElement");
			innerTr.appendChild(rowLeftElement);
			
			var rowRightElement = document.createElement("td");
			rowRightElement.setAttribute("class", "rowRightElement");
			innerTr.appendChild(rowRightElement);
			
			rowLeftElement.appendChild(formElementLabel);
			rowRightElement.appendChild(fieldElementContainer);
			rows++;
		}
		
		i++;
	}
	
	console.log(OpenPanel.GUIBuilder.Widget.widgets);
	var okButton = document.getElementById("okButton");
	okButton.onclick = function(){
		console.log(OpenPanel.GUIBuilder.Widget.getValues());
	}
	
}


