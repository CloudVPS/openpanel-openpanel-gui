OpenPanel.Command = {
		
};

OpenPanel.Command.Init  = {
	controller : {},
	execute : function(actionObject){
		this.controller.guiBuilder.hideModalMessageDiv();
		this.controller.guiBuilder.loadTemplate("templates/login.html", "app");
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
			this.buildMainArea();
			// OpenCore.Debug.createDebugList();
			OpenPanel.Controller.initializePing();
			this.controller.action({command: "Welcome"});
			
		} else {
			
		}
	},
	
	buildMainArea : function(){
		this.controller.guiBuilder.loadTemplate("templates/main.html", "app");
			this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
			OpenPanel.GUIBuilder.GUIElements.IconBar.setTargetDivName("iconBar");
			OpenPanel.GUIBuilder.GUIElements.ItemList.setTargetDivName("mainAreaLeft");
			OpenPanel.GUIBuilder.GUIElements.TabBar.setTargetDivName("tabBar");
			OpenPanel.GUIBuilder.GUIElements.FormBuilder.setTargetDivName("mainAreaForm");
			//this.controller.dataManager.initializeQuotaObject();	
			this.controller.action({command: "BuildIconBar"});
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

OpenPanel.Command.Welcome = {
	controller : {},
	execute : function(actionObject){
		var tabBarDiv = document.getElementById("tabBar");
		if(tabBarDiv != undefined){
			tabBarDiv.innerHTML = "";
		}
		var mainAreaDiv = document.getElementById("mainArea");
		mainAreaDiv.innerHTML = "";
		var welcomeDivHolder = document.createElement("div");
		welcomeDivHolder.setAttribute("id", "welcomeDivHolder");
		mainAreaDiv.appendChild(welcomeDivHolder);
		this.controller.guiBuilder.loadTemplate("dynamic/", "welcomeDivHolder");
		this.controller.guiBuilder.GUIElements.IconBar.highliteItem("Welcome");
		this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
	}
}
