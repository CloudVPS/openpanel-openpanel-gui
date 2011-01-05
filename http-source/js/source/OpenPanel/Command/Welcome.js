OpenPanel.Command.Welcome = {
	controller : {},
	resizeFunction : null,
	execute : function(actionObject){
		document.getElementById("itemListArea").innerHTML = "";
		var tabBarDiv = document.getElementById("tabBar");
		if(tabBarDiv != undefined){
			tabBarDiv.innerHTML = "";
		}
		var fullWindowAreaDiv = document.getElementById("fullWindowArea").setStyle({backgroundColor: "#E8E8E8", height: (document.viewport.getHeight() - 170) + "px", marginTop: "2px", left: "0px", right: "0px", width: "100%"});
		fullWindowAreaDiv.innerHTML = "";
		var welcomeDivHolder = document.createElement("div");
		welcomeDivHolder.setAttribute("id", "welcomeDivHolder");
		
		fullWindowAreaDiv.appendChild(welcomeDivHolder);
		fullWindowAreaDiv.style.visibility = "visible";
		this.controller.guiBuilder.loadTemplate("templates/welcome.html", "welcomeDivHolder");
		this.controller.guiBuilder.loadTemplate("dynamic/welcome.html", "welcomeAreaHolder");
		this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
		this.resizeFunction = this.resize.bind(this);
		Element.observe(window, "resize", this.resizeFunction);
		this.resize();
	},
	
	stopResizing : function(){
		Element.stopObserving(window, "resize", this.resizeFunction);
	},
	resize : function (event){
		var viewportHeight = document.viewport.getHeight();
		var viewportWidth = document.viewport.getWidth();
		if(viewportHeight < 300){
			//$("mainAreaRight").setStyle({ height: 65 + "px"});
			var h = 300;
		} else {
			//$("mainAreaRight").setStyle({ height: ""});
			var h = viewportHeight;
		}
		$("modal").setStyle({ height: (h - 20)+ "px", width: (viewportWidth - 2)+ "px", border: "1px solid #f0f"});
		var hh = (h-129) + "px";
		$("mainArea").setStyle({ height: (h + 40) + "px"});
		$("fullWindowArea").setStyle({ height: hh});
		//$("fullWindowArea").setStyle({ height: (h+180)+"px"});
		$("saveButtonHolder").setStyle({ top: (h-30) + "px", width : viewportWidth + "px"});
		$("itemListArea").setStyle({ height: (h-139) + "px"});
		$("welcomeDivHolder").setStyle({ height: (h-108) + "px"});
		$$("#mainArea .left").first().setStyle({ height: (h-155) + "px"});
		$$("#mainArea .right").first().setStyle({ height: (h-155) + "px"});
		$$("#mainArea .bottom").first().setStyle({ top: (h-54) + "px"});
		$$("#mainArea .bottomLeft").first().setStyle({ top: (h-54) + "px"});
		$$("#mainArea .bottomRight").first().setStyle({ top: (h-54) + "px"});
		$("mainAreaRight").setStyle({ height: (h-150) + "px"});
		var itemListButtons = $("itemListButtons");
		if(itemListButtons){
			itemListButtons.setStyle({ top: (h-30) + "px"});
		}
		var itemGridView = $$(".itemGridView").first();
		if(itemGridView != null){
			itemGridView.setStyle({ height: (h-108) + "px"});
			$$(".itemGridViewContents").first().setStyle({ height: (h-124) + "px"});
		}
		
		if(h <= 300){
			$("welcomeLogoHolder").setStyle({ height: 0 + "px"});
			$("welcomeLogoHolder").hide();
			$("welcomeArea").setStyle({ top: 0 + "px", height: "191px"});
		} else if(h > 300 && h < 400){
			$("welcomeLogoHolder").setStyle({ height: 0 + "px"});
			$("welcomeLogoHolder").hide();
			$("welcomeArea").setStyle({ top: 0 + "px", height: (h-110) + "px"});
		} else if(h > 400 && h < 500){
			$("welcomeLogoHolder").show();
			$("welcomeLogoHolder").setStyle({ height: (h - 300) + "px"});
			$("welcomeArea").setStyle({ top: (h - 300) + "px", height: 191 + "px"});
		} else if(h > 500){
			$("welcomeLogoHolder").show();
			$("welcomeLogoHolder").setStyle({ height: 200 + "px"});
			$("welcomeArea").setStyle({ top: 200 + "px", height: (h-309) + "px"});
		}
	}
}
