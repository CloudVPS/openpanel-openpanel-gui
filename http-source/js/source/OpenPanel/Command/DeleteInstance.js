OpenPanel.Command.DeleteInstance  = {
	controller : {},
	execute : function(actionObject){
		console.log("deleeeteeeee");
		if(actionObject.openCoreObject != undefined && actionObject.instance != undefined) {
			
			var actionObjectId = actionObject.instance.uuid;
			var objectIDString = "";
			if(actionObject.instance.id){
				objectIDString = " '" + actionObject.instance.id + "'";
			}
			var className = actionObject.openCoreObject.name;
			var r = this.controller.dataManager.deleteInstance(className, actionObjectId);
			if (this.controller.dataManager.errorId == 0) {
				actionObject.openCoreObject.fetchedInstances = false;
				actionObject.openCoreObject.getInstances();
				
				this.controller.currentRootClassInstance 	= actionObject.openCoreObject.getFirstInstance();
				
				this.controller.iconBarClick(actionObject.openCoreObject);
				
				OpenPanel.GUIBuilder.growl(" ", "Successfully deleted " + actionObject.openCoreObject.description + " object" + objectIDString);
				
			} else {
				throw new Error(this.dataManager.errorMessage);
			}
		}
	}
}