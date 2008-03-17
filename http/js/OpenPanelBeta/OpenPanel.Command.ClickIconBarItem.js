OpenPanel.Command.ClickIconBarItem  = {
	controller : {},
	clickedIconBarItem : {},
	
	execute : function(actionObject){
		var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(actionObject.className);
		if(openCoreObject != undefined){
			var test = document.getElementById("mainAreaLeft");
			if (test == undefined) {
				OpenPanel.Command.Login.buildMainArea();
				this.controller.guiBuilder.GUIElements.IconBar.highliteItem(openCoreObject.name);
			}
			openCoreObject.setHasFetchedInstances(false);
			//var instances								= openCoreObject.getInstances();
			openCoreObject.getInstancesAsync(OpenPanel.Command.ClickIconBarItem, "getInstancesDone", openCoreObject);
			this.clickedIconBarItem = openCoreObject;
		} else {
			// errors here
			throw new Error ("openCoreObject is undefined")
		}
	},
	
	getInstancesDone : function(openCoreObject){
		
		this.controller.currentRootClass 			= openCoreObject;
		this.controller.currentRootClassInstance 	= openCoreObject.getFirstInstance();
		this.controller.iconBarClick(openCoreObject);
	}
	
	
}


