OpenPanel.Command.ShowDeleteInstanceFromFormObject  = {
	controller : {},
	execute : function(actionObject){
		// TODO: add confirm shizzle here
		actionObject.command = "DeleteInstanceFromFormObject"; 
		this.controller.action(actionObject);
	}
}

