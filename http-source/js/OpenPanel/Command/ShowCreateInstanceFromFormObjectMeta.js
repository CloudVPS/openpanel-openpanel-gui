OpenPanel.Command.ShowCreateInstanceFromFormObjectMeta  = {
	controller : {},
	execute : function(actionObject){
		if (actionObject.formObject != undefined && actionObject.openCoreObject != undefined && actionObject.openCoreObject != undefined) {
			this.controller.showCreateInstanceFromFormObjectMeta(
				actionObject.formObject, 
				actionObject.openCoreObject, 
				actionObject.formObjectHolder, 
				"CreateInstanceFromFormObject");
		}
	}
}