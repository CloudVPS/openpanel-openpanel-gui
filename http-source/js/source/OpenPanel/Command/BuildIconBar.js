OpenPanel.Command.BuildIconBar  = {
	controller : {},
	execute : function(actionObject) {
		this.controller.dataManager.rootObject.getChildren();
		this.controller.guiBuilder.GUIElements.IconBar.setOpenCoreObject(this.controller.dataManager.rootObject);
		this.controller.guiBuilder.GUIElements.IconBar.build();
	}
}


