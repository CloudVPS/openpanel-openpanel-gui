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
		//try {
			this.lastCommand = actionObject.command;
			this.lastArgumentObject = actionObject;
			var actionObject = this.lastArgumentObject;
			console.log(actionObject.command);
			switch (actionObject.command) {
				
				case "init":
					// load login screen
					this.guiBuilder.loadTemplate("login.html", "app");
					var targetElement = document.getElementById("app");
					targetElement.innerHTML = "";
					this.guiBuilder.renderLogin(targetElement, actionObject);
				break;
				
				case "login":
					if(actionObject.userName != undefined && actionObject.password!=undefined){
						if(this.dataManager.login(actionObject.userName, actionObject.password)){
							rootObject = new OpenCore.DataManager.OpenCoreObject({}, "ROOT");
							this.currentUser = actionObject.userName;
							
							this.guiBuilder.loadTemplate("main.html", "app");
							OpenPanel.GUIBuilder.GUIElements.IconBar.setTargetDivName("iconBar");
							OpenPanel.GUIBuilder.GUIElements.ItemList.setTargetDivName("mainAreaLeft");
							OpenPanel.GUIBuilder.GUIElements.TabBar.setTargetDivName("tabBar");
							OpenPanel.GUIBuilder.GUIElements.FormBuilder.setTargetDivName("mainAreaForm");
							this.dataManager.initializeQuotaObject();	
							this.action({command: "buildIconBar"});
							OpenCore.Debug.createDebugList();
							
							//OpenCore.RPC.RequestHandler.test(this.action, { command: "loginDone"});
							
						} else {
							this.action({ command : "init", msg: "login failed"})
						}
					}
				break;
				
				case "loginDone":
					console.log(actionObject);
					
				break;
					
				case "buildIconBar":
					// root actionObjectecten
					// 
					this.dataManager.rootObject.getChildren();
					this.guiBuilder.GUIElements.IconBar.setOpenCoreObject(this.dataManager.rootObject);
					this.guiBuilder.GUIElements.IconBar.build();
				break;
				
				case "clickIconBarItem":
					// root class
					// root item
					
					var openCoreObject = this.dataManager.getOpenCoreObjectByName(actionObject.className);
					if(openCoreObject != undefined){
						openCoreObject.setHasFetchedInstances(false);
						var instances					= openCoreObject.getInstances();
						this.currentRootClass 			= openCoreObject;
						this.currentRootClassInstance 	= openCoreObject.getFirstInstance();
						this.iconBarClick(openCoreObject);
						
						
						
					} else {
						// errors here
					}
				break;
				
				case "clickObjectListItem":
					var openCoreObject = this.dataManager.getOpenCoreObjectByName(actionObject.className);
					if (openCoreObject != undefined) {
						this.currentParentUUID = actionObject.instanceUUID;
						this.currentRootClassInstance 	= openCoreObject.getInstanceByUUID(actionObject.instanceUUID);
						this.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.currentRootClassInstance.uuid);
						this.guiBuilder.GUIElements.FormBuilder.build();
					}
				break;
	
				case "clickTabBarItem":
					var openCoreObject = this.dataManager.getOpenCoreObjectByName(actionObject.className);
					if(openCoreObject != undefined && this.currentRootClassInstance!=undefined && this.currentRootClassInstance.uuid != undefined){
						this.currentRootClass 			= openCoreObject;
						this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(openCoreObject);
						this.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.currentRootClassInstance.uuid);
						this.guiBuilder.GUIElements.FormBuilder.build();
					}
				break;
				
				case "updateRootInstance":
					if(actionObject.openCoreObject != undefined && actionObject.instance != undefined && actionObject.formValues != undefined){
						this.currentRootClassInstance = actionObject.instance;
						var openCoreObject = actionObject.openCoreObject;
						var instance = actionObject.instance;
						var formValues = actionObject.formValues;
						
						var actionObjectectId;
						if(openCoreObject.singleton == true){
							actionObjectectId = openCoreObject.singletonValue;
						} else {
							actionObjectectId = instance.id;
						}
						var r = this.dataManager.updateInstance(openCoreObject.name, actionObjectectId, formValues);
						if(this.dataManager.errorId == 0){
							var i = OpenCore.DataManager.getRecordByObjectId(openCoreObject.name, actionObjectectId);
							openCoreObject.instances[actionObjectectId] = i.body.data.actionObjectect[openCoreObject.name];
							this.currentRootClassInstance = openCoreObject.instances[actionObjectectId];
							this.iconBarClick(openCoreObject);
						} else {
							alert("error in updateRootInstance");
						}
					}
				break;
				
				case "deleteInstance":
					if(actionObject.openCoreObject != undefined && actionObject.instance != undefined){
						var actionObjectectId = actionObject.instance.uuid;
						var className = actionObject.openCoreObject.name;
						this.dataManager.deleteInstance(className, actionObjectectId);
						
						actionObject.openCoreObject.fetchedInstances = false;
						actionObject.openCoreObject.getInstances();
						
						this.currentRootClassInstance 	= actionObject.openCoreObject.getFirstInstance();
						this.iconBarClick(actionObject.openCoreObject);
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
						var actionObjectectId = actionObject.formValues.id;
						var parentId = actionObject.optionalCallBackObject.parentUUID;
						
						var r = this.dataManager.createInstance(className, actionObjectectId, parentId, actionObject.formValues);
						if (this.dataManager.errorId == 0) {
							actionObject.optionalCallBackObject.openCoreObject.fetchedInstances = false;
							actionObject.optionalCallBackObject.openCoreObject.getInstances();
							actionObject.optionalCallBackObject.build();
							this.guiBuilder.deletePopUp();
						} else {
							alert("error occurred");
						}
					
					}
				break;
				
				case "createInstanceFromItemList":
					if(actionObject.openCoreObject != undefined && actionObject.formValues != undefined){
						
						var className = actionObject.openCoreObject.name;
						var actionObjectectId = actionObject.formValues.id;
						var parentId = actionObject.openCoreObject.parent.uuid;
						
						var r = this.dataManager.createInstance(className, actionObjectectId, parentId, actionObject.formValues);
						if (this.dataManager.errorId == 0) {
							actionObject.openCoreObject.fetchedInstances = false;
							actionObject.openCoreObject.getInstances();
							this.currentRootClassInstance = actionObject.openCoreObject.instances[actionObjectectId];
							this.iconBarClick(actionObject.openCoreObject);
							//this.guiBuilder.GUIElements.ItemList.setOpenCoreObject(actionObject.openCoreObject);
							//this.guiBuilder.GUIElements.ItemList.build();
							this.guiBuilder.deletePopUp();
						} else {
							throw new Exception(this.dataManager.errorMessage);
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
						
					// delete popup
					// this.showCreateInstanceFromFormObject(actionObject.formObject, actionObject.formObjectHolder, "deleteInstanceFromFormObject");
					}
				break;
				
				case "saveForm":
					console.log(actionObject);
				break;
			}
			
				OpenCore.Debug.controllerDebug(this);
				console.log("---------------------------");
		/* } catch (e) {
			// errors are caught here
			var errorMsg;
			if (this.dataManager.getErrorId() != 0) {
				errorMsg = this.dataManager.getErrorMessage();
			} else {
				errorMsg = e.message;
			}
			if(this.dataManager.getErrorId() == "1"){
				this.action({ command: "init"});
			}
			console.log(errorMsg);
			alert(errorMsg); 
		} */
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
	
	iconBarClick : function(openCoreObject){
		this.guiBuilder.GUIElements.ItemList.setOpenCoreObject(openCoreObject);
		this.guiBuilder.GUIElements.ItemList.build();
		this.tabBarClick(openCoreObject);
		
	},
	
	tabBarClick : function(openCoreObject){
		if (openCoreObject.getFirstInstance() != undefined) {
			this.guiBuilder.GUIElements.TabBar.setOpenCoreObject(openCoreObject);
			this.guiBuilder.GUIElements.TabBar.build();
			
			var firstTabOpenCoreObject = this.guiBuilder.GUIElements.TabBar.getFirstTabItem();
			
			this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(firstTabOpenCoreObject);
			this.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID("ROOT");
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
	}
						
}
