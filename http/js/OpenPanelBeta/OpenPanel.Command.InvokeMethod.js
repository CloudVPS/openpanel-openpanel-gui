OpenPanel.Command.InvokeMethod  = {
	controller : {},
	execute : function(actionObject){
		console.log(actionObject);
		var openCoreObject = actionObject.openCoreObject;
		var className = openCoreObject.name;
		var methodName = actionObject.methodName;
		this.controller.dataManager.invokeMethodAsync(methodName, className, this, "done", {});
	},
	
	done : function(args){
		console.log(args);	
	}
}


