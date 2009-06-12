OpenPanel.Command.SaveForm  = {
	controller : {},
	execute : function(actionObject){
		var newActionObject = {};
		var transport =  actionObject.transport;
		
		newActionObject.numberOfChildObjects = transport.length;
		newActionObject.done = 0;
		newActionObject.errors = [];
		newActionObject.failed = false;
		
		newActionObject.command = "SaveFormDone";
		
		for(var i = 0;i<transport.length;i++) {
			var openCoreObject = transport[i].openCoreObject;
			var formData = transport[i].formData;
			var instance = transport[i].instance;
			newActionObject.openCoreObject = openCoreObject;
			this.controller.dataManager.updateInstanceAsync(openCoreObject.name, instance.uuid, formData, this.controller, "action", newActionObject);
		}
	}
}

