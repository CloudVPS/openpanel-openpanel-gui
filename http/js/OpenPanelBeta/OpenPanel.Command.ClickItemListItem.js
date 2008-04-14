OpenPanel.Command.ClickItemListItem  = {
	controller : {},
	execute : function(actionObject){
		var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(actionObject.className);
		if (openCoreObject != undefined) {
			console.log("opencoreobject", openCoreObject);
			this.controller.currentParentUUID = actionObject.instanceUUID;
			this.controller.currentRootClassInstance 	= openCoreObject.getInstanceByUUID(actionObject.instanceUUID);
			this.controller.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.controller.currentRootClassInstance.uuid);
			this.controller.guiBuilder.GUIElements.FormBuilder.build();
		}
	}
}
