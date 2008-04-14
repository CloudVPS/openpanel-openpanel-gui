OpenPanel.Command.CreateInstanceFromItemList  = {
	controller : {},
	execute : function(actionObject){
		if(actionObject.openCoreObject != undefined && actionObject.formValues != undefined){
							
			var className = actionObject.openCoreObject.name;
			var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(className);
			
			var actionObjectId = actionObject.formValues.id;
			var parentId = actionObject.openCoreObject.parent.uuid;
			
			var r = this.controller.dataManager.createInstance(className, actionObjectId, parentId, actionObject.formValues);
			if (this.controller.dataManager.errorId == 0) {
				openCoreObject.fetchedInstances = false;
				var instances = openCoreObject.getInstances();
				for(var key in instances){
					console.log(key, instances[key]);
				}
				this.controller.currentRootClassInstance = openCoreObject.instances[actionObjectId];
				
				this.controller.iconBarClick(openCoreObject);
				this.controller.guiBuilder.deletePopUp();
			} else {
				throw new Error(this.controller.dataManager.errorMessage);
			}
		}
	}
}

