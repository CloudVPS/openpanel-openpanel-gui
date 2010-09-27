/**
 * @author jp
 */

OpenCore.Debug = {
	debugObject: function(className){
		var openCoreObject = OpenCore.DataManager.getOpenCoreObjectByName(className);
		console.log(openCoreObject);
		var r = openCoreObject.getInstances();
		console.log(r);
	},
	
	createDebugList: function(){
		var elm = document.getElementById("debugList");
		elm.innerHTML = "";
		this.buildList(elm, OpenCore.DataManager.rootObject);
	},
	
	buildList: function (elm, obj){
		if (typeof(obj) != "function") {
			var className = obj.name;
			var li = document.createElement("li");
			li.setAttribute("id", className);
			var liSpan = document.createElement("span");
			li.appendChild(liSpan);
			var liText = document.createTextNode(className);
			liSpan.onclick = function(){
				OpenCore.Debug.debugObject(this.parentNode.id)
			}
			liSpan.appendChild(liText);
			elm.appendChild(li);
			
			if (obj.children != undefined && obj.children.length > 0) {
				var ul = document.createElement("ul");
				ul.setAttribute("id", className);
				li.appendChild(ul);
				for (var key in obj.children) {
					var childObject = obj.children[key];
					this.buildList(ul, childObject);
				}
			}
		}
	},
	
	buildFormList : function(elm, obj){
		if(typeof(obj) != "function" && obj.openCoreObject != undefined){
			var className = obj.openCoreObject.name;
			var li = document.createElement("li");
			li.setAttribute("id", className);
			var liSpan = document.createElement("span");
			li.appendChild(liSpan);
			var liText = document.createTextNode(className);
			//liSpan.onclick = function(){
			//	OpenCore.Debug.debugObject(this.parentNode.id)
			//}
			liSpan.appendChild(liText);
			elm.appendChild(li);
			
			if (obj.childFormObjects != undefined ) {
				var ul = document.createElement("ul");
				ul.setAttribute("id", className);
				li.appendChild(ul);
				for (var key in obj.childFormObjects) {
					var childObject = obj.childFormObjects[key];
					this.buildFormList(ul, childObject);
				}
			}
		}
	},
	
	controllerDebug : function(controller){
		var elm = document.getElementById("controllerDebug");
		elm.innerHTML = "[controller]";
		var hook = this;
		for (var key in controller) {
			if (this.debugValues[key] != undefined) {
				var pElement = document.createElement("p");
				pElement.appendChild(document.createTextNode(key));
				
				var valueElement = this.createDebugLabel(controller, key);
				if (valueElement != undefined) {
					pElement.appendChild(valueElement);
				}
				
				pElement.key = key;
				pElement.controller = controller;
				pElement.onclick = function(){
					//console.log(this.controller[this.key]);
				}
				elm.appendChild(pElement);
			}
		}
		
		var elm2 = document.getElementById("debugFormObjectList");
		if(elm2!=undefined){
			
		}
		var elmC = elm2.childNodes;
		for(var i = 0 ; i<elmC.length;i++){
			elm2.removeChild(elmC[i]);
		}
		this.buildFormList(elm2, OpenPanel.GUIBuilder.GUIElements.FormBuilder.rootFormObject);
	},
	
	debugValues: {
		// controller
		currentRootClassInstance: {
			value : "uuid"
		},
		
		lastCommand : {
			value: "__self__"
		},
		
		currentRootClass : {
			value: "name"
		},
		
		currentParentUUID: {
			value: "__self__"
		}
	},
	
	createDebugLabel: function(obj, key){
		var debugValue;
		
		if(this.debugValues[key]!=undefined){
			var val = this.debugValues[key].value;
			if(val == "__self__"){
				debugValue = obj[key];
			} else {
				if (obj[key]!= undefined && obj[key][val] != undefined) {
					debugValue = obj[key][val];
				}
			}
			if (debugValue != undefined) {
				var valP = document.createElement("p");
				valP.setAttribute("class", "debugValue");
				valP.appendChild(document.createTextNode(debugValue));
				return valP;
			}
		}
	}
}

