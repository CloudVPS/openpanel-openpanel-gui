OpenPanel.Command = {
		
};

OpenPanel.Command.Init  = {
	controller : {},
	execute : function(actionObject){
		this.controller.guiBuilder.loadTemplate("login.html", "app");
		//var targetElement = document.getElementById("app");
		//targetElement.innerHTML = "";
		this.controller.guiBuilder.renderLogin(document.getElementById("loginDiv"), actionObject);
		
	}
}

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
			this.controller.currentUser = actionObject.userName;
			
			this.controller.guiBuilder.loadTemplate("main.html", "app");
			OpenPanel.GUIBuilder.GUIElements.IconBar.setTargetDivName("iconBar");
			OpenPanel.GUIBuilder.GUIElements.ItemList.setTargetDivName("mainAreaLeft");
			OpenPanel.GUIBuilder.GUIElements.TabBar.setTargetDivName("tabBar");
			OpenPanel.GUIBuilder.GUIElements.FormBuilder.setTargetDivName("mainAreaForm");
			
			this.controller.dataManager.initializeQuotaObject();	
			this.controller.action({command: "BuildIconBar"});
			// OpenCore.Debug.createDebugList();
			OpenPanel.Controller.initializePing();
			
			
		} else {
			
		}
	}
}

OpenPanel.Command.Logout  = {
	controller : {},
	execute : function(actionObject){
		this.controller.dataManager.logOut();
		this.controller.destroyPingTimeoutHandler();
		this.controller.action({command: "Init"});
	}
}