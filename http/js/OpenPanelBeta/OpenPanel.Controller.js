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
		console.log(actionObject);
		
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
					case "updateRootInstance":
						if(actionObject.openCoreObject != undefined && actionObject.instance != undefined && actionObject.formValues != undefined){
							this.currentRootClassInstance = actionObject.instance;
							var openCoreObject = actionObject.openCoreObject;
							var instance = actionObject.instance;
							var formValues = actionObject.formValues;
							
							var actionObjectId;
							if(openCoreObject.singleton == true){
								actionObjectId = openCoreObject.singletonValue;
							} else {
								actionObjectId = instance.id;
							}
							var r = this.dataManager.updateInstance(openCoreObject.name, actionObjectId, formValues);
							if(this.dataManager.errorId == 0){
								var i = OpenCore.DataManager.getRecordByObjectId(openCoreObject.name, actionObjectId);
								openCoreObject.instances[actionObjectId] = i.body.data.actionObjectect[openCoreObject.name];
								this.currentRootClassInstance = openCoreObject.instances[actionObjectId];
								this.iconBarClick(openCoreObject);
							} else {
								throw new Error(this.dataManager.errorMessage);
							}
						}
					break;
					
					case "deleteInstance":
						if(actionObject.openCoreObject != undefined && actionObject.instance != undefined){
							var actionObjectId = actionObject.instance.uuid;
							var className = actionObject.openCoreObject.name;
							var r = this.dataManager.deleteInstance(className, actionObjectId);
							if (this.dataManager.errorId == 0) {
								actionObject.openCoreObject.fetchedInstances = false;
								actionObject.openCoreObject.getInstances();
								
								this.currentRootClassInstance 	= actionObject.openCoreObject.getFirstInstance();
								this.iconBarClick(actionObject.openCoreObject);
							} else {
								throw new Error(this.dataManager.errorMessage);
							}
						}
					break;
					
					case "showCreateInstanceFromItemList":
						this.showCreateInstance(
							actionObject.openCoreObject, 
							actionObject.formObjectHolder, 
							"createInstanceFromItemList");
					break;
					
					case "showCreateInstanceFromFormObject":
						this.showCreateInstanceFromFormObject(
							actionObject.formObject, 
							actionObject.formObjectHolder, 
							"createInstanceFromFormObject");
					break;
					
					case "showCreateInstanceFromFormObjectMeta":
					if (actionObject.formObject != undefined && actionObject.openCoreObject != undefined && actionObject.openCoreObject != undefined) {
						this.showCreateInstanceFromFormObjectMeta(
							actionObject.formObject, 
							actionObject.openCoreObject, 
							actionObject.formObjectHolder, 
							"createInstanceFromFormObject");
					}
					break;
					
					case "createInstanceFromFormObject":
						
						if (actionObject.openCoreObject != undefined && actionObject.formValues != undefined) {
							var className = actionObject.openCoreObject.name;
							var actionObjectId = actionObject.formValues.id;
							var parentId = actionObject.optionalCallBackObject.parentUUID;
							
							var r = this.dataManager.createInstance(className, actionObjectId, parentId, actionObject.formValues);
							if (this.dataManager.errorId == 0) {
								actionObject.optionalCallBackObject.openCoreObject.fetchedInstances = false;
								actionObject.optionalCallBackObject.openCoreObject.getInstances();
								actionObject.optionalCallBackObject.build();
								this.guiBuilder.deletePopUp();
							} else {
								throw new Error(this.dataManager.errorMessage);
							}
						
						}
					break;
					
					case "createInstanceFromItemList":
						if(actionObject.openCoreObject != undefined && actionObject.formValues != undefined){
							
							var className = actionObject.openCoreObject.name;
							var actionObjectId = actionObject.formValues.id;
							var parentId = actionObject.openCoreObject.parent.uuid;
							
							var r = this.dataManager.createInstance(className, actionObjectId, parentId, actionObject.formValues);
							if (this.dataManager.errorId == 0) {
								actionObject.openCoreObject.fetchedInstances = false;
								actionObject.openCoreObject.getInstances();
								this.currentRootClassInstance = actionObject.openCoreObject.instances[actionObjectId];
								this.iconBarClick(actionObject.openCoreObject);
								//this.guiBuilder.GUIElements.ItemList.setOpenCoreObject(actionObject.openCoreObject);
								//this.guiBuilder.GUIElements.ItemList.build();
								this.guiBuilder.deletePopUp();
							} else {
								throw new Error(this.dataManager.errorMessage);
							}
						}
					break;
					
					case "showDeleteInstanceFromFormObject":
						actionObject.command = "deleteInstanceFromFormObject"; 
						this.action(actionObject);
					break;
					
					case "deleteInstanceFromFormObject":
						if (actionObject.openCoreObject != undefined && actionObject.formObject != undefined) {
							var openCoreObject = actionObject.openCoreObject;
							var formObject = actionObject.formObject;
							
							var instance;
							var className;
							if(openCoreObject.meta == true){
								instance = formObject.currentMetaInstance;
								className = instance["class"];
							} else {
								instance = formObject.currentInstance;
								className = openCoreObject.name;
							}
							this.dataManager.deleteInstance(className, instance.uuid);
							console.log(instance.uuid + " " + className);
							openCoreObject.fetchedInstances = false;
							openCoreObject.getInstances();
							formObject.build();
							
						}
					break;
					
					case "saveForm":
						console.log(actionObject);
						var formBuilder = OpenPanel.GUIBuilder.GUIElements.FormBuilder;
						var transport = actionObject.transport;
						
						var gotErrors = false;
						var errorMessages = "";
						for(var i = 0;i<actionObject.transport.length;i++){
							var openCoreObject = transport[i].openCoreObject;
							
							var formData = transport[i].formData;
							var instance = transport[i].instance;	
							var r = this.dataManager.updateInstance(openCoreObject.name, instance.uuid, formData);
							if(this.dataManager.getErrorId() != 0){
								gotErrors = true;
							}
						}
						
						formBuilder.rootFormObject.build();
						
					break;
				}
			}
			
				OpenCore.Debug.controllerDebug(this);
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
		// is object updateable?
		// show popup
		
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
		// 
		
		
		// popupFormObject.fields.formPanel
	},
	
	showCreateInstanceFromFormObjectMeta : function(formObject, openCoreObject, formObjectHolder, finishedAction){
		console.log(openCoreObject);
		var popUpDiv = this.guiBuilder.createPopUp();
		var popupFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		popupFormObject.setOpenCoreObject(openCoreObject);
		popupFormObject.setTargetDiv(formObjectHolder);
		popupFormObject.setController(this);
		popupFormObject.createModalFields(openCoreObject, {}, finishedAction, popUpDiv, formObject);
		popupFormObject.fields.formPanel.enable();
	},
	
	iconBarClick : function(openCoreObject){
		this.guiBuilder.GUIElements.ItemList.setOpenCoreObject(openCoreObject);
		this.guiBuilder.GUIElements.ItemList.build();
		this.tabBarClick(openCoreObject);
		
	},
	
	tabBarClick : function(openCoreObject){
		console.log("tabBarClick");
		if (openCoreObject.getFirstInstance() != undefined) {
			this.guiBuilder.GUIElements.TabBar.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.TabBar.build();
			
			
			var firstTabOpenCoreObject = this.guiBuilder.GUIElements.TabBar.getFirstTabItem();
			console.log("XXXXX firstTabOpenCoreObject");
			console.log(firstTabOpenCoreObject);
			
			this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(firstTabOpenCoreObject);
			this.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.currentRootClassInstance.uuid);
			this.guiBuilder.GUIElements.FormBuilder.build();
			if (this.currentRootClassInstance != undefined) {
				this.guiBuilder.GUIElements.ItemList.highliteItem(this.currentRootClassInstance.uuid);
			}
			this.guiBuilder.GUIElements.TabBar.highliteItem(firstTabOpenCoreObject.name);
		} else {

			this.guiBuilder.GUIElements.TabBar.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.TabBar.build();
			this.guiBuilder.GUIElements.TabBar.disable();
			this.guiBuilder.GUIElements.FormBuilder.clean();
		}
	},
	
	initializePing : function(){
		if (this.pingTimeoutHandler == undefined) {
			this.pingTimeoutHandler = setTimeout("OpenPanel.Controller.ping()", 120000);
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
				throw new Error("Reply is very erroneous: " + d);
			} else {
				
				if(OpenCore.DataManager.errorId == 0){
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
			case "RPCError":
				alert(e.name + ": " + e.message+ " : " + e.status);
				
			break;
			
			case "OpenCoreError":
				
				switch(this.dataManager.getErrorId()){
					
					case 12288:
					case 8193:
						
						alert(e);
						this.action({ command : "Init", msg: e.message})
						OpenPanel.Controller.proceedAfterError();
					break;
					default:
						alert(e);
					break;
					
					
				}
				
			break;
			
			default:
				//alert(e.name + ": " + e.message);
				console.log(typeof(this.pingTimeoutHandler));
					
				
				var targetDiv = OpenPanel.GUIBuilder.createPopUp();
				this.error = new Array();
				for(var errorKey in e){
					this.error.push([errorKey, e[errorKey]]);
				}
				
				OpenPanel.GUIBuilder.loadTemplateIntoDiv("fatalError.html", targetDiv);
				
				
			break;
		}
		for(var key in e){
			console.log(key +  ": " + e[key]);
		}
	},
	
	proceedAfterError : function(){
		OpenPanel.GUIBuilder.hideModalMessageDiv();
		OpenPanel.Controller.initializePing();
	}
}
