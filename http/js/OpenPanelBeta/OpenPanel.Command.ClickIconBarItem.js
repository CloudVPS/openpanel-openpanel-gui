OpenPanel.Command.ClickIconBarItem  = {
	controller : {},
	execute : function(actionObject){
		var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(actionObject.className);
		if(openCoreObject != undefined){
			openCoreObject.setHasFetchedInstances(false);
			var instances								= openCoreObject.getInstances();
			this.controller.currentRootClass 			= openCoreObject;
			this.controller.currentRootClassInstance 	= openCoreObject.getFirstInstance();
			this.controller.iconBarClick(openCoreObject);
		} else {
			// errors here
			throw new Error ("openCoreObject is undefined")
		}
	}
	
	
}


