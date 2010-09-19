
OpenPanel.Command.Logout  = {
	controller : {},
	execute : function(actionObject){
		this.controller.dataManager.logOut();
		document.location.href = "/";
		//this.controller.destroyPingTimeoutHandler();
		//this.controller.action({command: "Init"});
	}
}
