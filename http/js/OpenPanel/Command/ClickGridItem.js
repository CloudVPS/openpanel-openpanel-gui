OpenPanel.Command.ClickGridItem  = {
	controller : {},
	execute : function(actionObject){
		var formObject = actionObject.formObject;
		var instance = actionObject.instance;
		
		var actualInstance;
		formObject.setCurrentInstance(instance);
		
		// this has to go ^^
		
		if (formObject.openCoreObject.meta == true) {
			var record = this.controller.dataManager.getRecord(instance["class"], instance.id);
			instance = record[instance["class"]];
			if (instance != undefined) {
				formObject.currentMetaInstance = instance;
			} else {
				// errors here
			}
		}
		actualInstance = instance;
		
		var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(actualInstance["class"]);
		formObject.createFields(openCoreObject, actualInstance, "", formObject.fieldsDiv);
		
		// create childFormObjects
		formObject.childFormObjectsDiv.innerHTML = "";
		var first = true;
		for (var childOpenCoreObjectName in openCoreObject.children) {
		
			var childOpenCoreObject = openCoreObject.children[childOpenCoreObjectName];
			var someDiv = document.createElement("div");
			formObject.childFormObjectsDiv.appendChild(someDiv);
			
			if (typeof(childOpenCoreObject) == "object" && childOpenCoreObject.classInfo["class"].metabase == "") {
				formObject.createChildFormObject(childOpenCoreObject, actualInstance.uuid, someDiv, this.controller);
				if(first == true){
					first = false;
				}
			}
		}
		
		OpenPanel.GUIBuilder.goToAnchor(formObject.openCoreObject.name);
	}
}


