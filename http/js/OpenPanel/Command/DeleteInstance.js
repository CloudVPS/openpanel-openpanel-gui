OpenPanel.Command.DeleteInstance  = {
	controller : {},
	execute : function(actionObject){
		if(0 && actionObject.openCoreObject != undefined && actionObject.instance != undefined) {
			
			var actionObjectId = actionObject.instance.uuid;
			var className = actionObject.openCoreObject.name;
			var r = this.controller.dataManager.deleteInstance(className, actionObjectId);
			if (this.controller.dataManager.errorId == 0) {
				actionObject.openCoreObject.fetchedInstances = false;
				actionObject.openCoreObject.getInstances();
				
				this.controller.currentRootClassInstance 	= actionObject.openCoreObject.getFirstInstance();
				this.controller.iconBarClick(actionObject.openCoreObject);
			} else {
				throw new Error(this.dataManager.errorMessage);
			}
		}
	}
}