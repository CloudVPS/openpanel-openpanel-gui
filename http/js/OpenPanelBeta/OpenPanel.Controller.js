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
	
	action: function(actionObject){
		console.log("controller actionObject", actionObject);
		
		try {
			this.lastCommand = actionObject.command;
			this.lastArgumentObject = actionObject;
			var actionObject = this.lastArgumentObject;
			var commandObject = OpenPanel.Command[actionObject.command];
			
			if(commandObject != undefined){
				commandObject.controller = this;
				commandObject.execute(actionObject);
			} else {
				
				switch (actionObject.command) {
					
					default:
					break;
				}
			}
			
			//OpenCore.Debug.controllerDebug(this);
			console.log("---------------------------");
		} catch (e) {
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
		console.log(openCoreObject);
		var popUpDiv = this.guiBuilder.createPopUp();
		var popupFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		popupFormObject.setOpenCoreObject(openCoreObject);
		popupFormObject.setTargetDiv(formObjectHolder);
		popupFormObject.setController(this);
		popupFormObject.createModalFields(openCoreObject, {}, finishedAction, popUpDiv, formObject);
		popupFormObject.fields.formPanel.enable();
	},
	
	iconBarClick : function(openCoreObject) {
		this.guiBuilder.GUIElements.ItemList.setOpenCoreObject(openCoreObject);
		this.guiBuilder.GUIElements.ItemList.build();
		this.tabBarClick(openCoreObject);
	},
	
	tabBarClick : function(openCoreObject) {
		
		if (openCoreObject.getFirstInstance() != undefined) {
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
			this.guiBuilder.GUIElements.TabBar.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.TabBar.build();
			this.guiBuilder.GUIElements.TabBar.disable();
			this.guiBuilder.GUIElements.FormBuilder.clean();
		}
	},
	
	initializePing : function(){
		if (this.pingTimeoutHandler == undefined) {
			this.pingTimeoutHandler = setTimeout("OpenPanel.Controller.ping()", 60000);
		}
	},
	
	destroyPingTimeoutHandler : function(){
		if (this.pingTimeoutHandler != undefined) {
			clearTimeout(this.pingTimeoutHandler);
			this.pingTimeoutHandler = undefined;
		}
	},
	
	
	ping : function(){
		console.log("ping");
		this.dataManager.getRecordsAsync("ping", undefined, OpenPanel.Controller, "pingDone", {}, true);
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
				
				if(OpenCore.DataManager.getErrorId() == 0){
					OpenPanel.Controller.destroyPingTimeoutHandler();
					OpenPanel.Controller.initializePing();
				} else if(OpenCore.DataManager.errorId == 12288){
					OpenPanel.Controller.action("Init");
				} else {
					errorMsg = OpenCore.DataManager.getErrorMessage();
					OpenPanel.Controller.destroyPingTimeoutHandler();
					throw new Error(errorMsg);
				}
			}
		} catch (e) {
			this.handleErrors(e);
		}
	},
	
	handleErrors : function(e){	
		OpenPanel.GUIBuilder.hideLoadingDiv();
		clearTimeout(this.pingTimeoutHandler);
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
					
					alert("mekker " + errorString);
					if(goToInit == true){
						this.action({
							command: "Init",
							msg: e.message
						})
						OpenPanel.Controller.proceedAfterError();
					}
					
				} else {
					switch (e.errorCode) {
					
						case 12288:
						case 8193:
							
							alert(e);
							this.action({
								command: "Init",
								msg: e.message
							})
							OpenPanel.Controller.proceedAfterError();
						break;
						default:
							alert(e);
						break;
					}
				}
			break;
			
			case "RPCError":
			default:
				
				var targetDiv = OpenPanel.GUIBuilder.createPopUp();
				this.error = new Array();
				for(var errorKey in e){
					this.error.push([errorKey, e[errorKey]]);
				}
				this.displayError(targetDiv);
			break;
		}
		
		for(var key in e){
			console.log(key +  ": " + e[key]);
		}
	},
	
	displayError : function(targetDiv){
		var bElement = document.createElement("b");
		bElement.appendChild(document.createTextNode("Error"));
		targetDiv.appendChild(bElement);
		
		var tableElement = document.createElement("table");
		targetDiv.appendChild(tableElement);
		
		for (var i=0;i<this.error.length;i++) {
			if(i==0) {
				var tbodyBombElement = document.createElement("tbody");
				tableElement.appendChild(tbodyBombElement);
				var trBombElement = document.createElement("tr");
				tbodyBombElement.appendChild(trBombElement);
				
				var tdBombElement = document.createElement("td");
				tdBombElement.setAttribute("colspan", "3");
				trBombElement.appendChild(tdBombElement);
				var imageElement = document.createElement("img");
				imageElement.setAttribute("src", "/images/gui/error_bomb.png");
				imageElement.setAttribute("alt", "Boom!");
				tdBombElement.appendChild(imageElement)
			}
			var errorCouple = this.error[i];
			var tbodyElement = document.createElement("tbody");
			tableElement.appendChild(tbodyElement);
				
			var trElement = document.createElement("tr");
			tbodyElement.appendChild(trElement);
			
			var tdKeyElement = document.createElement("td");
			tdKeyElement.setAttribute("valign", "top");
			tdKeyElement.appendChild(document.createTextNode(errorCouple[0]));
			trElement.appendChild(tdKeyElement);
			var tdValueElement = document.createElement("td");
			tdValueElement.setAttribute("valign", "top");
			tdValueElement.appendChild(document.createTextNode(errorCouple[1]));
			trElement.appendChild(tdValueElement);
			
		}
	},
	
	proceedAfterError : function(){
		OpenPanel.GUIBuilder.hideModalMessageDiv();
		OpenPanel.Controller.initializePing();
	}
}
