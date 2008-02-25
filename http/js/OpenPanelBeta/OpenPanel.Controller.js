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
	
	
	action: function(command, obj){
		//try {
			this.lastCommand = command;
			this.lastArgumentObject = obj;
			console.log(command);
			switch (command) {
				
				case "init":
					// load login screen
					this.guiBuilder.loadTemplate("login.html", "app");
					var targetElement = document.getElementById("app");
					targetElement.innerHTML = "";
					this.guiBuilder.renderLogin(targetElement, obj);
				break;
				
				case "login":
					if(obj.userName != undefined && obj.password!=undefined){
						
						if(this.dataManager.login(obj.userName, obj.password)){
							rootObject = new OpenCore.DataManager.OpenCoreObject({}, "ROOT");
							
							this.guiBuilder.loadTemplate("main.html", "app");
							OpenPanel.GUIBuilder.GUIElements.IconBar.setTargetDivName("iconBar");
							OpenPanel.GUIBuilder.GUIElements.ItemList.setTargetDivName("mainAreaLeft");
							OpenPanel.GUIBuilder.GUIElements.TabBar.setTargetDivName("tabBar");
							OpenPanel.GUIBuilder.GUIElements.FormBuilder.setTargetDivName("mainAreaForm");
							this.dataManager.initializeQuotaObject();	
							this.action("buildIconBar");
							OpenCore.Debug.createDebugList();
						} else {
							this.action("init", {msg: "login failed"})
						}
					}
				break;
				
				case "buildIconBar":
					// root objecten
					// 
					this.dataManager.rootObject.getChildren();
					this.guiBuilder.GUIElements.IconBar.setOpenCoreObject(this.dataManager.rootObject);
					this.guiBuilder.GUIElements.IconBar.build();
				break;
				
				case "clickIconBarItem":
					// root class
					// root item
					
					var openCoreObject = this.dataManager.getOpenCoreObjectByName(obj.className);
					if(openCoreObject != undefined){
						
						var instances					= openCoreObject.getInstances();
						this.currentRootClass 			= openCoreObject;
						this.currentRootClassInstance 	= openCoreObject.getFirstInstance();
						this.iconBarClick(openCoreObject);
						
						
						
					} else {
						// errors here
					}
				break;
				
				case "clickObjectListItem":
					var openCoreObject = this.dataManager.getOpenCoreObjectByName(obj.className);
					if (openCoreObject != undefined) {
						this.currentParentUUID = obj.instanceUUID;
						this.currentRootClassInstance 	= openCoreObject.getInstanceByUUID(obj.instanceUUID);
						this.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.currentRootClassInstance.uuid);
						this.guiBuilder.GUIElements.FormBuilder.build();
					}
				break;
	
				case "clickTabBarItem":
					var openCoreObject = this.dataManager.getOpenCoreObjectByName(obj.className);
					if(openCoreObject != undefined && this.currentRootClassInstance!=undefined && this.currentRootClassInstance.uuid != undefined){
						this.currentRootClass 			= openCoreObject;
						this.guiBuilder.GUIElements.FormBuilder.setOpenCoreObject(openCoreObject);
						this.guiBuilder.GUIElements.FormBuilder.setOpenCoreParentUUID(this.currentRootClassInstance.uuid);
						this.guiBuilder.GUIElements.FormBuilder.build();
					}
				break;
				
				case "updateRootInstance":
					if(obj.openCoreObject != undefined && obj.instance != undefined && obj.formValues != undefined){
						this.currentRootClassInstance = obj.instance;
						var openCoreObject = obj.openCoreObject;
						var instance = obj.instance;
						var formValues = obj.formValues;
						
						var objectId;
						if(openCoreObject.singleton == true){
							objectId = openCoreObject.singletonValue;
						} else {
							objectId = instance.id;
						}
						var r = this.dataManager.updateInstance(openCoreObject.name, objectId, formValues);
						if(this.dataManager.errorId == 0){
							var i = OpenCore.DataManager.getRecordByObjectId(openCoreObject.name, objectId);
							openCoreObject.instances[objectId] = i.body.data.object[openCoreObject.name];
							this.currentRootClassInstance = openCoreObject.instances[objectId];
							this.iconBarClick(openCoreObject);
						} else {
							alert("error in updateRootInstance");
						}
					}
				break;
				
				case "deleteInstance":
					if(obj.openCoreObject != undefined && obj.instance != undefined){
						var objectId = obj.instance.uuid;
						var className = obj.openCoreObject.name;
						this.dataManager.deleteInstance(className, objectId);
						
						obj.openCoreObject.fetchedInstances = false;
						obj.openCoreObject.getInstances();
						
						this.currentRootClassInstance 	= obj.openCoreObject.getFirstInstance();
						this.iconBarClick(obj.openCoreObject);
					}
				break;
				
				case "showCreateInstanceFromItemList":
					this.showCreateInstance(
						obj.openCoreObject, 
						obj.formObjectHolder, 
						"createInstanceFromItemList");
				break;
				
				case "showCreateInstanceFromFormObject":
					this.showCreateInstanceFromFormObject(
						obj.formObject, 
						obj.formObjectHolder, 
						"createInstanceFromFormObject");
				break;
				
				case "showCreateInstanceFromFormObjectMeta":
				if (obj.formObject != undefined && obj.openCoreObject != undefined && obj.openCoreObject != undefined) {
					this.showCreateInstanceFromFormObjectMeta(
						obj.formObject, 
						obj.openCoreObject, 
						obj.formObjectHolder, 
						"createInstanceFromFormObject");
				}
				break;
				
				case "createInstanceFromFormObject":
					
					if (obj.openCoreObject != undefined && obj.formValues != undefined) {
						var className = obj.openCoreObject.name;
						var objectId = obj.formValues.id;
						var parentId = obj.optionalCallBackObject.parentUUID;
						
						var r = this.dataManager.createInstance(className, objectId, parentId, obj.formValues);
						if (this.dataManager.errorId == 0) {
							obj.optionalCallBackObject.openCoreObject.fetchedInstances = false;
							obj.optionalCallBackObject.openCoreObject.getInstances();
							obj.optionalCallBackObject.build();
							this.guiBuilder.deletePopUp();
						}
						console.log("createInstanceFromFormObject " + className + " " + objectId + " " + parentId);
						console.log(obj);
					}
				break;
				
				case "createInstanceFromItemList":
					if(obj.openCoreObject != undefined && obj.formValues != undefined){
						
						var className = obj.openCoreObject.name;
						var objectId = obj.formValues.id;
						var parentId = obj.openCoreObject.parent.uuid;
						
						var r = this.dataManager.createInstance(className, objectId, parentId, obj.formValues);
						if (this.dataManager.errorId == 0) {
							obj.openCoreObject.fetchedInstances = false;
							obj.openCoreObject.getInstances();
							this.currentRootClassInstance = obj.openCoreObject.instances[objectId];
							this.iconBarClick(obj.openCoreObject);
							//this.guiBuilder.GUIElements.ItemList.setOpenCoreObject(obj.openCoreObject);
							//this.guiBuilder.GUIElements.ItemList.build();
							this.guiBuilder.deletePopUp();
						} else {
							alert("error occurred");
						}
					}
				break;
				
				case "showDeleteInstanceFromFormObject":
					this.action("deleteInstanceFromFormObject", obj);
				break;
				
				case "deleteInstanceFromFormObject":
					if (obj.openCoreObject != undefined && obj.formObject != undefined) {
						var openCoreObject = obj.openCoreObject;
						var formObject = obj.formObject;
						
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
					// this.showCreateInstanceFromFormObject(obj.formObject, obj.formObjectHolder, "deleteInstanceFromFormObject");
					}
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
				this.action("init");
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
