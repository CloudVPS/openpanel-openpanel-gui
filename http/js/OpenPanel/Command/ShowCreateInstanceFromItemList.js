OpenPanel.Command.ShowCreateInstanceFromItemList  = {
	controller : {},
	execute : function(actionObject){
		this.controller.showCreateInstance(
			actionObject.openCoreObject, 
			actionObject.formObjectHolder, 
			"CreateInstanceFromItemList");
	}
}

