OpenPanel.Command.ClickTabBarItem  = {
	controller : {},
	execute : function(actionObject){
		var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(actionObject.className);
		if(openCoreObject != undefined 
				&& this.controller.currentRootClassInstance!=undefined 
				&& this.controller.currentRootClassInstance.uuid != undefined)
		{
			this.controller.currentRootClass = openCoreObject;
			this.controller.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(openCoreObject);
			this.controller.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.controller.currentRootClassInstance.uuid);
			this.controller.guiBuilder.GUIElements.FormBuilder.build();
		}
	}
	
	
	
}


