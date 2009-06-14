OpenPanel.Command.Welcome = {
	controller : {},
	execute : function(actionObject){
		document.getElementById("itemListArea").innerHTML = "";
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
