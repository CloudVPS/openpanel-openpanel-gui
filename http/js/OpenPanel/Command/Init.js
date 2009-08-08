OpenPanel.Command.Init  = {
	controller : {},
	execute : function(actionObject){
		var detected = this.detect();
		if (detected.fail == false) {
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
			var e = new OpenPanel.Command.Init.InitError();
			e.message = "Unsupported browser. ";
			e.description =  detected.failText;
			e.status = -1;
			throw e;
		}
	},
	
	InitError : function(message, errorCode){
		var err = new Error(message)
	    // take care of IE5/5.5
	    if (!err.message) {
	        err.message = message
		}
		
		err.errorCode = errorCode!=undefined?errorCode:"";
	    err.name = "InitError";
	    return err;
	},
	
	browsers : {
		"Firefox" : 3,
		"Safari" : 3,
		"Explorer" : 7,
		"iCab" : 0
	},
	
	detect : function(){
		var version = this.browsers[BrowserDetect.browser];
		var fail = false;
		var failText = "";
		/*
		if(version!=undefined){
			if(version == 0){
				failText = "We're sorry to tell you that your browser is not supported.";
				fail = true;	
			} else {
				if(version > parseFloat(BrowserDetect.version)){
					failText = "We're sorry to tell you that your browser is too old. Please use a newer version.";
					fail = true;	
				}
			}
		} */
						
		return { fail : fail, failText : failText, version: version}
	}
}

