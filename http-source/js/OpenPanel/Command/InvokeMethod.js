OpenPanel.Command.InvokeMethod  = {
	actionObject : {},
	controller : {},
	execute : function(actionObject){
		this.actionObject = actionObject;
		var openCoreObject = actionObject.openCoreObject;
		var className = openCoreObject.name;
		var methodName = actionObject.methodName;
		this.controller.dataManager.invokeMethodAsync(methodName, className, this, "done", {});
	},
	
	done : function(args){
		OpenPanel.GUIBuilder.growl(" ", "Successfully invoked " + this.actionObject.methodName);

		console.log(args);	
	}
}
