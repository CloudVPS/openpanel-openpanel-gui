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
	pingTimeoutHandler : {},
	
	
	currentRootClass: {},
	currentRootClassInstance: {},
	currentUser : {},
	
	action: function(actionObject){
		console.log(actionObject);
		
		try {
			this.lastCommand = actionObject.command;
			this.lastArgumentObject = actionObject;
			var actionObject = this.lastArgumentObject;
			console.log(actionObject.command);
			var commandObject = OpenPanel.Command[actionObject.command];
			
			if(commandObject != undefined){
				commandObject.controller = this;
				commandObject.execute(actionObject);
			} else {
				
				switch (actionObject.command) {
					case "LoginDone":
						console.log("controller");
						console.log(actionObject);
					break;
					
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
		this.pingTimeoutHandler = setTimeout("OpenPanel.Controller.ping()", 5000);
	},
	
	ping : function(){
		try {
			console.log("ping");
			this.dataManager.getRecords("ping");
			var errorMsg;
			if (OpenCore.DataManager.getErrorId() != 0) {
				errorMsg = OpenCore.DataManager.getErrorMessage();
				clearTimeout(this.pingTimeoutHandler);
				throw new Error(errorMsg);
			} else {
				OpenPanel.Controller.initializePing();
			}
		} catch (e){
			this.handleErrors(e);
		}
	},
	
	handleErrors : function(e){	
		
		switch(e.name){
			case "RPCError":
				alert(e.name + ": " + e.message+ " : " + e.status);
			break;
			
			case "OpenCoreError":
				alert(e);
				if(this.dataManager.getErrorId() == "12288"){
					this.action({ command: "Init"});
				} else {
					console.log(OpenCore.DataManager.getErrorId(), errorMsg);
					//alert(errorMsg); 
				}
			break;
			
			default:
				alert(e.name + ": " + e.message);
				clearTimeout(this.pingTimeoutHandler);
			
			break;
		}
		if (1) {
	        
	   
	    } else {
			var errorMsg;
			if (this.dataManager.getErrorId() != 0) {
				errorMsg = OpenCore.DataManager.getErrorMessage();
			} else {
				errorMsg = e.message;
			}
			
			
		}
		
		for(var key in e){
			console.log(key, e[key]);
		}
		
		
	}
}
