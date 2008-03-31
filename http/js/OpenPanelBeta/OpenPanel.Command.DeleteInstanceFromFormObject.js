OpenPanel.Command.DeleteInstanceFromFormObject  = {
	controller : {},
	execute : function(actionObject){
		if (actionObject.openCoreObject != undefined && actionObject.formObject != undefined) {
			var openCoreObject = actionObject.openCoreObject;
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
			console.log(instance.uuid + " " + className);
			openCoreObject.fetchedInstances = false;
			openCoreObject.getInstances();
			formObject.build();
			
		}
	}
}

