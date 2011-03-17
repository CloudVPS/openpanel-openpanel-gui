OpenPanel.Command.Welcome = {
    hasLoaded : false,
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
		this.hasLoaded = false;
		if(this.controller.guiBuilder.loadTemplate("templates/welcome.html", "welcomeDivHolder")){
    		if(this.controller.guiBuilder.loadTemplate("dynamic/welcome.html", "welcomeAreaHolder")){
        		this.controller.guiBuilder.GUIElements.FormBuilder.setSaveButtonVisibility(false);
        		this.resizeFunction = this.resize.bind(this);
        		Element.observe(window, "resize", this.resizeFunction);
        		this.resize();
    		    this.hasLoaded = true;
    		}
		}
	},
	
	stopResizing : function(){
		Element.stopObserving(window, "resize", this.resizeFunction);
	},
	resize : function (event){
	    if (this.hasLoaded == true) {
    		var viewportHeight = document.viewport.getHeight();
    		var viewportWidth = document.viewport.getWidth();
    		var h;
    		if(viewportHeight < 300){
    			h = 300;
    		} else {
    			h = viewportHeight;
    		}
    		$("modal").setStyle({ height: (h - 20)+ "px", width: (viewportWidth - 2)+ "px", border: "1px solid #f0f"});
    		var hh = (h-129) + "px";
    		$("mainArea").setStyle({ height: (h + 20) + "px"});
    		$("fullWindowArea").setStyle({ height: hh});
    		$("saveButtonHolder").setStyle({ top: (h-30) + "px", width : viewportWidth + "px"});
    		$("itemListArea").setStyle({ height: (h-199) + "px"});
    		$("welcomeDivHolder").setStyle({ height: (h-47) + "px"});
    		$$("#mainArea .left").first().setStyle({ height: (h-145) + "px"});
    		$$("#mainArea .right").first().setStyle({ height: (h-145) + "px"});
    		$$("#mainArea .bottom").first().setStyle({ top: (h-44) + "px"});
    		$$("#mainArea .bottomLeft").first().setStyle({ top: (h-44) + "px"});
    		$$("#mainArea .bottomRight").first().setStyle({ top: (h-44) + "px"});
    		$("mainAreaRight").setStyle({ height: (h-150) + "px"});
    		var itemListButtons = $("itemListButtons");
    		if(itemListButtons){
    			itemListButtons.setStyle({ top: (h-20) + "px"});
    		}
    		var itemGridView = $$(".itemGridView").first();
    		if(itemGridView != null) {
    			itemGridView.setStyle({ height: (h-78) + "px"});
    			$$(".itemGridViewContents").first().setStyle({ height: (h-114) + "px"});
    		}
    		
    		if(h <= 300){
    			$("welcomeLogoHolder").setStyle({ height: 0 + "px"});
    			$("welcomeLogoHolder").hide();
    			$("welcomeArea").setStyle({ top: 0 + "px", height: "222px"});
    		} else if(h > 300 && h < 400){
    			$("welcomeLogoHolder").setStyle({ height: 0 + "px"});
    			$("welcomeLogoHolder").hide();
    			$("welcomeArea").setStyle({ top: 0 + "px", height: (h-79) + "px"});
    		} else if(h > 400 && h < 500){
    			$("welcomeLogoHolder").show();
    			$("welcomeLogoHolder").setStyle({ height: (h - 300) + "px"});
    			$("welcomeArea").setStyle({ top: (h - 300) + "px", height: 220 + "px"});
    		} else if(h > 500){
    			$("welcomeLogoHolder").show();
    			$("welcomeLogoHolder").setStyle({ height: 200 + "px"});
    			$("welcomeArea").setStyle({ top: 200 + "px", height: (h-278) + "px"});
    		}
	    }
	}
}
