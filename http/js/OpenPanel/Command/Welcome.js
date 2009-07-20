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
		this.controller.guiBuilder.loadTemplate("dynamic/", "welcomeDivHolder");
		
		var holder = $j("#welcomeLogoHolder")[0];
		if (holder != undefined) {
			var logo = $j("#welcomeLogo")[0];
			var h = OpenPanel.GUIBuilder.pageHeight();
			var curWidth = logo.width;
			var curHeight = logo.height;
			var height = curHeight;
			var width = curWidth;
			
			if ((curHeight+450) > h) {
				if (h>480) {
					height = h-450;
				} else height = 30;
				
				width = curWidth * (height / curHeight);
				holder.style.width = width;
				holder.style.height = height;
				holder.style.marginLeft = "-" + (width/2) + "px";
				logo.width = width;
				logo.height = height;
			}
		}
		
		this.controller.guiBuilder.GUIElements.IconBar.highliteItem("Welcome");
		this.controller.guiBuilder.GUIElements.IconBar.setTitle("Welcome");
		this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
	},

}
