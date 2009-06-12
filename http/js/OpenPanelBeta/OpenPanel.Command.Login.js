OpenPanel.Command.Login  = {
	controller : {},
	execute : function(actionObject){
		if(actionObject.userName != undefined && actionObject.password!=undefined){
			this.controller.dataManager.loginAsync(actionObject.userName, actionObject.password, this, "loginDone", actionObject);
			/*if(this.controller.dataManager.login(actionObject.userName, actionObject.password)){
				// get user info
			} else {
				//this.controller.action({ command : "Init", msg: "login failed"})
			}*/
		} 
	},
	
	loginDone : function(data, callBackArguments){
		var actionObject = callBackArguments;
		if(callBackArguments.header.errorid == 0){
			var rootObject = new OpenCore.DataManager.OpenCoreObject({}, "ROOT");
			this.controller.currentUser = actionObject.callBackArguments.userName; // que? this is wrong
			this.buildMainArea();
			// OpenCore.Debug.createDebugList();
			OpenPanel.Controller.initializePing();
			this.controller.action({command: "Welcome"});
			
		} else {
			
			//throw new OpenCoreError(callBackArguments.header.error, callBackArguments.header.errorid);
			this.controller.action({ command : "Init", msg: "login failed"})
		}
	},
	
	buildMainArea : function(){
		this.controller.guiBuilder.loadTemplate("templates/main.html", "app");
			document.getElementById("modalLoadingDiv").className = "modalLoadingDiv";
			this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
			OpenPanel.GUIBuilder.GUIElements.IconBar.setTargetDivName("iconBar");
			OpenPanel.GUIBuilder.GUIElements.ItemList.setTargetDivName("mainAreaLeft");
			OpenPanel.GUIBuilder.GUIElements.TabBar.setTargetDivName("tabBar");
			OpenPanel.GUIBuilder.GUIElements.FormBuilder.setTargetDivName("mainAreaForm");
			//this.controller.dataManager.initializeQuotaObject();	
			this.controller.action({command: "BuildIconBar"});
	}
}
