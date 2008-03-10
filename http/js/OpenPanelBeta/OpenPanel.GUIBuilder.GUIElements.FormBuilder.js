/**
 * @author jp
 */
OpenPanel.GUIBuilder.GUIElements.FormBuilder = {
	
	targetDiv : {},
	openCoreObject : {},
	parentUUID: "",
	rootFormObject: {},
	controller: {},
	currentRootClassInstance: {},
	currentInstances : {},
	
	build : function(){
		this.targetDiv.innerHTML = "";
		
		this.formObjectHolder = document.createElement("div");
		this.formObjectHolder.setAttribute("id", "formObjectHolder");
		this.targetDiv.appendChild(this.formObjectHolder);
		
		this.saveButtonHolder = document.createElement("div");
		this.saveButtonHolder.setAttribute("id", "saveButtonHolder");
		this.saveButtonHolder.appendChild(document.createTextNode("save"));
		this.targetDiv.appendChild(this.saveButtonHolder);
		
		this.rebuildButtonHolder = document.createElement("div");
		this.rebuildButtonHolder.setAttribute("id", "rebuildButtonHolder");
		this.rebuildButtonHolder.appendChild(document.createTextNode("rebuild"));
		this.targetDiv.appendChild(this.rebuildButtonHolder);
		
		var hook = this;
		this.saveButtonHolder.onclick = function(){
			var transport = hook.getData();
			var actionObject = {
					command : "saveForm",
					formBuilder: hook,
					transport : transport
					
			};
			
			hook.controller.action(actionObject);
		}
		
		this.rebuildButtonHolder.onclick = function(){
			hook.rootFormObject.build();
		}
		
		this.rootFormObject = new  OpenPanel.GUIBuilder.GUIElements.FormObject();
		this.rootFormObject.setOpenCoreObject(this.openCoreObject);
		
		this.rootFormObject.setParentUUID(this.parentUUID);
		this.rootFormObject.setTargetDiv(this.formObjectHolder);
		this.rootFormObject.setController(this.controller);
		this.rootFormObject.setFormBuilder(this);
		this.rootFormObject.build();
	},
	
	clean : function(){
		this.targetDiv.innerHTML = "";	
	},
	
	getData : function(){
		var transport = [];
		this.rootFormObject.getData(transport);	
		transport.reverse();
		return transport;
		/*
		
		var gotErrors = false;
		var errorMessages = "";
		for(var i = 0;i<transport.length;i++){
			var openCoreObject = transport[i].openCoreObject;
			console.log(openCoreObject);
			var formData = transport[i].formData;
			var instance = transport[i].instance;	
			var r = this.controller.dataManager.updateInstance(openCoreObject.name, instance.uuid, formData);
			if(this.controller.dataManager.getErrorId() != 0){
				gotErrors = true;
				errorMessages+= "error: " + openCoreObject.name + " : " + this.controller.dataManager.getErrorMessage() + "\n";
			}
		}
		if(gotErrors == true){
			throw new Exception(errorMessages);
		} else{
			this.rootFormObject.build();
		}
		*/
	},
	
	getInstance : function(name){
		if(this.currentInstances[name]!=undefined){
			return this.currentInstances[name];
		}
	},
	
	setCurrentInstance : function(name, instanceId){
		this.currentInstances[name] = instanceId;
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setOpenCoreParentUUID: function(parentUUID){
		this.parentUUID = parentUUID;
	},
	
	setTargetDivName : function(targetDivName){
		var targetDiv = document.getElementById(targetDivName);
		if(targetDiv != undefined){
			this.targetDiv = targetDiv;
		} else {
			alert("div does not exist "+ targetDivName);
		}
	},
	
	setCurrentRootClassInstance: function(currentRootClassInstance){
		this.currentRootClassInstance = currentRootClassInstance;
	}
	
}

