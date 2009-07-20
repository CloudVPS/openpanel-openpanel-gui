
OpenPanel.Command.Logout  = {
	controller : {},
	execute : function(actionObject){
		this.controller.dataManager.logOut();
		this.controller.destroyPingTimeoutHandler();
		this.controller.action({command: "Init"});
	}
}
