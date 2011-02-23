OpenPanel.Command.DeleteInstance  = {
	controller : {},
	execute : function(actionObject){
		if(actionObject.openCoreObject != undefined && actionObject.instance != undefined) {
			
			var actionObjectId = actionObject.instance.uuid;
			var objectIDString = "";
			if(actionObject.instance.id){
				objectIDString = " '" + actionObject.instance.id + "'";
			}
			var className = actionObject.openCoreObject.name;
			var r = this.controller.dataManager.deleteInstance(className, actionObjectId);
			if (this.controller.dataManager.errorId == 0) {
			    this.controller.dataManager.buildQuota();
			    
				actionObject.openCoreObject.fetchedInstances = false;
				actionObject.openCoreObject.getInstances();
				
				this.controller.currentRootClassInstance 	= actionObject.openCoreObject.getFirstInstance();
				
				this.controller.iconBarClick(actionObject.openCoreObject);
				
				OpenPanel.GUIBuilder.growl(" ", "Successfully deleted " + actionObject.openCoreObject.description + " object" + objectIDString);
				OpenPanel.Command.Welcome.resize();
			} else {
				throw new Error(this.dataManager.errorMessage);
			}
		}
	}
}