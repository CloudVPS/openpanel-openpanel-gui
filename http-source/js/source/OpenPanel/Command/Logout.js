
OpenPanel.Command.Logout  = {
	controller : {},
	execute : function(actionObject){
	    this.controller.isLoggedIn = false;
		this.controller.dataManager.logOut();
	}
}
