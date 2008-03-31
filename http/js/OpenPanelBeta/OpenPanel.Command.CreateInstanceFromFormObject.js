OpenPanel.Command.CreateInstanceFromFormObject  = {
	controller : {},
	execute : function(actionObject){
		if (actionObject.openCoreObject != undefined && actionObject.formValues != undefined) {
			var className = actionObject.openCoreObject.name;
			var actionObjectId = actionObject.formValues.id;
			var parentId = actionObject.optionalCallBackObject.parentUUID;
			
			var r = this.controller.dataManager.createInstance(className, actionObjectId, parentId, actionObject.formValues);
			if (this.controller.dataManager.errorId == 0) {
				actionObject.optionalCallBackObject.openCoreObject.fetchedInstances = false;
				actionObject.optionalCallBackObject.openCoreObject.getInstances();
				actionObject.optionalCallBackObject.build();
				this.controller.guiBuilder.deletePopUp();
			} else {
				throw new Error(this.controller.dataManager.errorMessage);
			}
		
		}
	}
}

