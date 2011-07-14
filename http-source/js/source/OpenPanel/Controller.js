/**
 * @author jp
 */
OpenPanel.Controller = {
	lastCommand: "",
	lastArgumentObject: {},
	dataManager: {},
	guiBuilder: {},
	selectedRootInstance: "",
	selectedTabObject: "",
	currentRootClass: {},
	currentRootClassInstance: {},
	currentUser : {},
	isLoggedIn : false,
	action: function(actionObject){
		try {
			this.lastCommand = actionObject.command;
			this.lastArgumentObject = actionObject;
			var actionObject = this.lastArgumentObject;
			var commandObject = OpenPanel.Command[actionObject.command];
			
			if(actionObject.nextAction){
				commandObject.nextAction = actionObject.nextAction;
			}
			
			if(commandObject != undefined){
				commandObject.controller = this;
				commandObject.execute(actionObject);
			}
		} catch (e) {
			console.log(e);
			// errors are caught here
			this.handleErrors(e);
		}
	},
	
	setDataManager: function(dataManager){
		this.dataManager = dataManager;
		dataManager.setController(OpenPanel.Controller);
	},
	
	setGuiBuilder: function(guiBuilder){
		this.guiBuilder = guiBuilder;
		guiBuilder.setController(OpenPanel.Controller);
		for(var key in guiBuilder.GUIElements){
			if(guiBuilder.GUIElements[key].controller != undefined){
				guiBuilder.GUIElements[key].controller = this;
			}
		}
	},
	
	showCreateInstance : function(openCoreObject, formObjectHolder, finishedAction){
		var popUpDiv = this.guiBuilder.createPopUp();
		var formObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		formObject.setOpenCoreObject(openCoreObject);
		formObject.setTargetDiv(formObjectHolder);
		formObject.setController(this);
		formObject.createModalFields(openCoreObject, {}, finishedAction, popUpDiv, {});
		formObject.fields.formPanel.enable();
	},
	
	showCreateInstanceFromFormObject : function(formObject, formObjectHolder, finishedAction){
		var d = document.createElement("div");
		
		var popUpDiv = this.guiBuilder.createPopUp();
		var popupFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		popupFormObject.setOpenCoreObject(formObject.openCoreObject);
		popupFormObject.setTargetDiv(formObjectHolder);
		popupFormObject.setController(this);
		popupFormObject.createModalFields(formObject.openCoreObject, {}, finishedAction, popUpDiv, formObject);
		popupFormObject.fields.formPanel.enable();
	},
	
	showCreateInstanceFromFormObjectMeta : function(formObject, openCoreObject, formObjectHolder, finishedAction) {
		var popUpDiv = this.guiBuilder.createPopUp();
		var popupFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		popupFormObject.setOpenCoreObject(openCoreObject);
		popupFormObject.setTargetDiv(formObjectHolder);
		popupFormObject.setController(this);
		popupFormObject.createModalFields(openCoreObject, {}, finishedAction, popUpDiv, formObject);
		popupFormObject.fields.formPanel.enable();
	},
	
	iconBarClick : function(openCoreObject) {
		// update item list
		
		// current instance is first instance!
		this.guiBuilder.GUIElements.ItemList.setOpenCoreObject(openCoreObject);
		
		this.guiBuilder.GUIElements.ItemList.build();
		this.guiBuilder.GUIElements.ItemList.takeFocus();
		
		// click tab bar
		this.tabBarClick(openCoreObject);
	},
	
	tabBarClick : function(openCoreObject) {
		// populate tab bar
		if (openCoreObject.getFirstInstance() != undefined) {
			// new TabBar(openCoreObject);
			this.guiBuilder.GUIElements.TabBar.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.TabBar.build();	
			var firstTabOpenCoreObject = this.guiBuilder.GUIElements.TabBar.getFirstTabItem();
			
			if (firstTabOpenCoreObject != undefined) {
				this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(firstTabOpenCoreObject);
				this.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.currentRootClassInstance.uuid);

				this.guiBuilder.GUIElements.FormBuilder.build();
				
				if (this.currentRootClassInstance != undefined) {
					this.guiBuilder.GUIElements.ItemList.highliteItem(this.currentRootClassInstance.uuid);
				}
				this.guiBuilder.GUIElements.TabBar.highliteItem(firstTabOpenCoreObject.name);
			} else {
				this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(openCoreObject);
			}
			
		} else {
			
			this.guiBuilder.GUIElements.TabBar.clean();
			this.guiBuilder.GUIElements.FormBuilder.clean();
			this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.FormBuilder.build();
			//this.guiBuilder.GUIElements.FormBuilder.targetDiv.update("new!<a href=\"\">" + openCoreObject.classInfo["class"].explanation +"</a>");
			/*
			this.guiBuilder.GUIElements.TabBar.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.TabBar.build();
			this.guiBuilder.GUIElements.TabBar.disable();
			var firstTabOpenCoreObject = this.guiBuilder.GUIElements.TabBar.getFirstTabItem();
			
			if(firstTabOpenCoreObject){
				this.guiBuilder.GUIElements.TabBar.highliteItem(firstTabOpenCoreObject.name);
			}
			
			this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.FormBuilder.build();
			this.guiBuilder.GUIElements.FormBuilder.targetDiv.update("new!");
			*/
		}
	},
	
	initializePing : function() {
	    OpenPanel.Controller.destroyPingTimeoutHandler();
	    
	    OpenPanel.Controller.periodicalExecuter = new PeriodicalExecuter( function (pe) {
	        pe.stop();
	        OpenPanel.Controller.ping();
	    }, 30);
	},
	
	destroyPingTimeoutHandler : function(){
	    if(OpenPanel.Controller.periodicalExecuter != undefined){
            OpenPanel.Controller.periodicalExecuter.stop();
        }
	},
	
	ping : function(){
	    if(OpenPanel.Controller.isLoggedIn == true){
	         this.dataManager.getRecordsAsync("ping", undefined, OpenPanel.Controller, "pingDone", {}, true);
	    }
	},
	
	pingDone : function(callBackArguments){
		try {
			if(callBackArguments.data == undefined){
				var d = "";
				for(var key in callBackArguments){
					d+=key + " " + callBackArguments[key] + "\n";
				}
				throw new Error("Unexpected server reply (opencore gone?): " + d);
				
			} else {
				if(callBackArguments.header.errorid == 0){
					OpenPanel.Controller.initializePing();
				} else if (callBackArguments.header.errorid == 12288) {
					OpenPanel.Controller.action("Init");
				} else {
					errorMsg = OpenCore.DataManager.getErrorMessage();
					throw new Error(errorMsg);
				}
			}
		} catch (e) {
			this.handleErrors(e);
		}
	},
	
	handleErrors : function(e){	
		OpenPanel.GUIBuilder.hideLoadingDiv();
		OpenPanel.Controller.destroyPingTimeoutHandler();
		switch(e.name){
			case "OpenCoreError":
			
				if (e.threaded == true) {
					var errors = e.errors;
					
					var errorString = "";
					var goToInit = false;
					for(var i = 0;i<errors.length;i++){
						var error = errors[i];
						if (typeof(error) == "object") {
							errorString += error.errorId + " : " + error.error + "\n";
							if (error.errorId == 12288 || error.errorId == 8193) {
								goToInit = true;
							}
						}
					}
					
					alert("OpenCore said: " + errorString);
					if(goToInit == true){
						document.location.href = "/";
					}
					
				} else {
					switch (e.errorCode) {
						case 12288:
						    if(OpenPanel.Controller.isLoggedIn == true){
						        alert("You have been logged out due to inactivity");
						    }
							document.location.href = "/";
						break;
							
						case 8193:
							alert("error: " + e.message);
							document.location.href = "/";
						break;
						default:
							alert(e);
						break;
					}
				}
			break;
			
			case "RPCError":
				console.log("RPC error");
				var targetDiv = OpenPanel.GUIBuilder.createPopUp();
				
				OpenPanel.GUIBuilder.displayError([["", ""]], targetDiv, "The OpenPanel Core service isn't reachable. Is the openpaneld daemon running?", null, true);
			break;
			
			case "InitError":
				
				var targetDiv = OpenPanel.GUIBuilder.createPopUp();
				this.error = new Array();
				for(var errorKey in e){
					this.error.push([errorKey, e[errorKey]]);
				}
				
				OpenPanel.GUIBuilder.loadTemplateIntoDiv("/templates/browsers.html", targetDiv);
				$("errorMessageExtra").innerHTML = "<b>" + e.description + "</b>";
			break;
			
			default:
				var extraText = "please try logging in again.";
				var targetDiv = OpenPanel.GUIBuilder.createPopUp();
				var stack;
				this.error = new Array();
				for(var errorKey in e){
					if(errorKey=="stack") {
						stack = e[errorKey];
					} else {
						this.error.push([errorKey, e[errorKey]]);
					}
				}
				
				OpenPanel.GUIBuilder.displayError(this.error, targetDiv, extraText, stack);
			break;
		}
	},
	
	
	proceedAfterError : function(){
		OpenPanel.GUIBuilder.hideModalMessageDiv();
		OpenPanel.Controller.initializePing();
	}
}
