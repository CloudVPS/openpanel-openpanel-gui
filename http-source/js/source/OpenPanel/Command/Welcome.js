OpenPanel.Command.Welcome = {
	controller : {},
	execute : function(actionObject){
		document.getElementById("itemListArea").innerHTML = "";
		var tabBarDiv = document.getElementById("tabBar");
		if(tabBarDiv != undefined){
			tabBarDiv.innerHTML = "";
		}
		var fullWindowAreaDiv = document.getElementById("fullWindowArea");
		fullWindowAreaDiv.innerHTML = "";
		var welcomeDivHolder = document.createElement("div");
		welcomeDivHolder.setAttribute("id", "welcomeDivHolder");
		
		fullWindowAreaDiv.appendChild(welcomeDivHolder);
		fullWindowAreaDiv.style.visibility = "visible";
		this.controller.guiBuilder.loadTemplate("dynamic/welcome.html", "welcomeDivHolder");
		
		this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
	}
}
