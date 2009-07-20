OpenPanel.Command.ShowCreateInstanceFromFormObject  = {
	controller : {},
	execute : function(actionObject){
		this.controller.showCreateInstanceFromFormObject(
			actionObject.formObject, 
			actionObject.formObjectHolder, 
			"CreateInstanceFromFormObject");
	}
}

