OpenPanel.Command.DeleteInstanceFromFormObject  = {
	controller : {},
	execute : function(actionObject){
		if (actionObject.openCoreObject != undefined && actionObject.formObject != undefined) {
			var openCoreObject = actionObject.openCoreObject;
			var objectIDString = "";
			if(actionObject.openCoreObject.currentInstance.id){
				objectIDString = " '" + actionObject.openCoreObject.currentInstance.id + "'";
			}
			
			var formObject = actionObject.formObject;
			
			var instance;
			var className;
			if(openCoreObject.meta == true){
				instance = formObject.currentMetaInstance;
				className = instance["class"];
			} else {
				instance = formObject.currentInstance;
				className = openCoreObject.name;
			}
			this.controller.dataManager.deleteInstance(className, instance.uuid);
			openCoreObject.fetchedInstances = false;
			openCoreObject.getInstances();
			formObject.build();
			OpenPanel.GUIBuilder.growl(" ", "Successfully deleted " + actionObject.openCoreObject.description + " object" + objectIDString);
			OpenPanel.Command.Welcome.resize();
		}
	}
}

