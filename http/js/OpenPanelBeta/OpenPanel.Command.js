OpenPanel.Command = {
		
};

OpenPanel.Command.Init  = {
	controller : {},
	execute : function(actionObject){
		if (Ext.isGecko || Ext.isSafari) {
			this.controller.guiBuilder.hideModalMessageDiv();
			this.controller.guiBuilder.loadTemplate("templates/login.html", "app");
			//var targetElement = document.getElementById("app");
			//targetElement.innerHTML = "";
			this.controller.guiBuilder.renderLogin(document.getElementById("loginDiv"), actionObject);
		} else {
			var e = new Error();
			e.message = "Unsupported browser.";
			e.description = "Unfortunately this browser is not supported. IE and Opera support will be implemented in upcoming release candidates. Please try <a href=\"http://www.apple.com/safari/download/\">Safari</a> or <a href=\"http://www.getfirefox.com\">Firefox</a>. ";
			e.status = -1;
			throw e;
		}
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
			this.controller.currentUser = actionObject.callBackArguments.userName; // que? this is wrong
			this.buildMainArea();
			// OpenCore.Debug.createDebugList();
			OpenPanel.Controller.initializePing();
			this.controller.action({command: "Welcome"});
			
		} else {
			throw new OpenCoreError(callBackArguments.header.error, callBackArguments.header.errorid);
			
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
		this.controller.guiBuilder.GUIElements.IconBar.setTitle("Welcome");
		this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
	}
}
