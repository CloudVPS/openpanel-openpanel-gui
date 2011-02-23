OpenPanel.Command.Login  = {
	controller : {},
	execute : function(actionObject){
		if(actionObject.userName != undefined && actionObject.password!=undefined){
			$("loginForm").hide();
			$("loaderDiv").show();
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
		$("hiddenLogin").hide();
		$("loginForm").show();
		$("loaderDiv").hide();
		if(callBackArguments.header.errorid == 0){
			OpenPanel.KeyboardHandler.init();
			var rootObject = new OpenCore.DataManager.OpenCoreObject({}, "ROOT");
			this.controller.currentUser = actionObject.callBackArguments.userName; // que? this is wrong
			this.buildMainArea();
			OpenPanel.Controller.initializePing();
			this.controller.action({command: "Welcome"});
		} else {
			$("hiddenLogin").show();
			//throw new OpenCore.OpenCoreError(callBackArguments.header.error, callBackArguments.header.errorid);
			this.controller.action({ command : "Init", msg: "login failed"})
		}
	},
	
	buildMainArea : function(){
		this.controller.guiBuilder.loadTemplate("templates/main.html", "app");
		
		document.getElementById("modalLoadingDiv").className = "modalLoadingDiv";
		this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
		
		OpenPanel.GUIBuilder.GUIElements.ItemList.setTargetDivName("itemListArea");
		OpenPanel.GUIBuilder.GUIElements.TabBar.setTargetDivName("tabBar");
		OpenPanel.GUIBuilder.GUIElements.FormBuilder.setTargetDivName("mainAreaForm");
		OpenPanel.GUIBuilder.GUIElements.FormBuilder.setFullWindowOverlayDivName("fullWindowArea");
		
		this.controller.dataManager.initializeQuotaObject();	
		this.controller.action({command: "BuildIconBar"});
	}
}
