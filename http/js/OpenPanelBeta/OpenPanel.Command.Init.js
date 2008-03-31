OpenPanel.Command.Init  = {
	controller : {},
	execute : function(actionObject){
		if (Ext.isGecko || Ext.isSafari) {
			this.controller.guiBuilder.hideModalMessageDiv();
			this.controller.guiBuilder.loadTemplate("templates/login.html", "app");
			//var targetElement = document.getElementById("app");
			//targetElement.innerHTML = "";
			this.controller.guiBuilder.renderLogin(document.getElementById("loginDiv"), actionObject);
		} else {
			var e = new Error();
			e.message = "Unsupported browser.";
			e.description = "Unfortunately this browser is not supported. IE and Opera support will be implemented in upcoming release candidates. Please try <a href=\"http://www.apple.com/safari/download/\">Safari</a> or <a href=\"http://www.getfirefox.com\">Firefox</a>. ";
			e.status = -1;
			throw e;
		}
	}
}

