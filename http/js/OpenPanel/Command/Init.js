OpenPanel.Command.Init  = {
	controller : {},
	execute : function(actionObject){
		if (1) {
			document.getElementById("modalLoadingDiv").className = "modalLoadingDivLogin";
			this.controller.guiBuilder.hideModalMessageDiv();
			this.controller.guiBuilder.loadTemplate("templates/login.html", "app");
			this.controller.guiBuilder.renderLogin(document.getElementById("loginDiv"), actionObject);
			if(actionObject.msg != undefined){
				document.getElementById("loginMessageDiv").innerHTML = actionObject.msg;
			} else {
				document.getElementById("loginMessageDiv").innerHTML = "";
			}
		} else {
			var e = new Error();
			e.message = "Unsupported browser.";
			e.description = "Unfortunately this browser is not supported. IE and Opera support will be implemented in upcoming release candidates. Please try <a href=\"http://www.apple.com/safari/download/\">Safari</a> or <a href=\"http://www.getfirefox.com\">Firefox</a>. ";
			e.status = -1;
			throw e;
		}
	}
}

