OpenPanel.Command = {
		
};

OpenPanel.Command.Init  = {
		controller : {},
		execute : function(actionObject){
			this.controller.guiBuilder.loadTemplate("login.html", "app");
			var targetElement = document.getElementById("app");
			targetElement.innerHTML = "";
			this.controller.guiBuilder.renderLogin(targetElement, actionObject);
		}
	}

	OpenPanel.Command.Login  = {
		controller : {},
		execute : function(actionObject){
			if(actionObject.userName != undefined && actionObject.password!=undefined){
				if(this.controller.dataManager.login(actionObject.userName, actionObject.password)){
					console.log("/////////");
					OpenCore.RPC.RequestHandler.getRecordsAsync(
						this.controller.action, 
						{
							command: "LoginDone"
						}
					);
					
					console.log("/////////");
					
					rootObject = new OpenCore.DataManager.OpenCoreObject({}, "ROOT");
					this.controller.currentUser = actionObject.userName;
					
					this.controller.guiBuilder.loadTemplate("main.html", "app");
					OpenPanel.GUIBuilder.GUIElements.IconBar.setTargetDivName("iconBar");
					OpenPanel.GUIBuilder.GUIElements.ItemList.setTargetDivName("mainAreaLeft");
					OpenPanel.GUIBuilder.GUIElements.TabBar.setTargetDivName("tabBar");
					OpenPanel.GUIBuilder.GUIElements.FormBuilder.setTargetDivName("mainAreaForm");
					this.controller.dataManager.initializeQuotaObject();	
					this.controller.action({command: "BuildIconBar"});
					OpenCore.Debug.createDebugList();
					
					//OpenCore.RPC.RequestHandler.test(this.action, { command: "loginDone"});
					
					
					// OpenCore.DataManager.getRecordsAsync("User", function(args){console.log(args); } , {command: "LoginDone"});
					
				} else {
					this.controller.action({ command : "Init", msg: "login failed"})
				}
			}
		}
	}