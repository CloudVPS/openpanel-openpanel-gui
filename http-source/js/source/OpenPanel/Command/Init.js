OpenPanel.Command.Init  = {
	controller : {},
	
	execute : function(actionObject){
		OpenPanel.Command.Welcome.stopResizing();
		this.controller.guiBuilder.loadTemplate('templates/application.html', 'application');
		$$('body').first().setStyle({
			backgroundImage: 'url(/dynamic/wallpaper.jpg)'
		});
		var that = this;
		var beforeUnload = function (){
			that.controller.destroyPingTimeoutHandler();
			Event.stopObserving(window, "beforeunload", beforeUnload);
			OpenPanel.Controller.action({
				command: "Logout"
			});
		}
		Event.observe(window, "beforeunload", beforeUnload);
		
		$('loaderDiv').setStyle({ visibility: 'hidden'});
		$('app').setStyle({ visibility: 'visible'});
		
		$('tabCycleCatcher').observe('focus', function(){
			var first = $$('input')[0];
			if (first == undefined) return;
			if (first.id == "tabCycleCatcher") return;
			first.focus();
		});

		Event.observe(window, 'blur', function() {
			$('app').removeClassName('activeBrowserWindow').addClassName('inactiveBrowserWindow');
		});
		
		Event.observe(window,'focus', function() {
			$('app').removeClassName('inactiveBrowserWindow').addClassName('activeBrowserWindow');
		});
		
		var detected = this.detect();
		if (detected.fail == false) {
			$("hiddenLogin").show();
			this.controller.guiBuilder.GUIElements.LoginWindow.patchElements($("loginDiv"), actionObject);
			document.getElementById('userName').focus();
		} else {
			var e = new OpenPanel.Command.Init.InitError();
			e.message = "Unsupported browser. ";
			e.description = detected.failText;
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
		"Firefox" : 4,
		"Safari" : 4,
		"Explorer" : 8,
		"iCab" : 0,
		"Chrome" : 4
	},
	
	detect : function(){
		var version = this.browsers[BrowserDetect.browser];
		var fail = false;
		var failText = "";
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
		}
						
		return { 
			fail: fail,
			failText: failText, 
			version: version 
		}
	}
}

