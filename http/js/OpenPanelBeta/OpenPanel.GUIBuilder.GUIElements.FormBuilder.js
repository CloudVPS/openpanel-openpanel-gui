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
	isUpdateable : false,
	lastCreatedFormObject : {},
	
	build : function(){
		this.targetDiv.innerHTML = "";
		this.isUpdateable = false;
		
		this.formObjectHolder = document.createElement("div");
		this.formObjectHolder.setAttribute("id", "formObjectHolder");
		this.targetDiv.appendChild(this.formObjectHolder);
		
		
		this.setSaveButtonVisibility(false);
		
		this.rootFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		this.rootFormObject.setOpenCoreObject(this.openCoreObject);
		
		this.rootFormObject.setParentUUID(this.parentUUID);
		this.rootFormObject.setTargetDiv(this.formObjectHolder);
		this.rootFormObject.setController(this.controller);
		this.rootFormObject.setFormBuilder(this);
		
		this.rootFormObject.build();
	},
	
	setSaveButtonVisibility : function(isVisible){
		var saveButtonElement = document.getElementById("saveButton");
		saveButtonElement.setAttribute("style", "visibility: " + (isVisible==true?"visible":"hidden") +";");
	},
	finishLayout : function(formObject){
		if(formObject!=undefined){
			
			console.log("foo", formObject, formObject.isUpdateable);
			if(formObject.isUpdateable!= undefined && formObject.isUpdateable == true){
				this.isUpdateable = true;
				this.setSaveButtonVisibility(true);
			}
			
			if(formObject.parentFormObject!=undefined){
					this.finishLayout(formObject.parentFormObject);
				
			}
		}
		
	},	
	
	setIsUpdateable : function(isUpdateable){
		this.isUpdateable = isUpdateable;
	},
	
	clean : function(){
		this.targetDiv.innerHTML = "";	
	},
	
	getData : function(){
		var transport = [];
		this.rootFormObject.getData(transport);	
		transport.reverse();
		return transport;
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
	},
	
	setLastCreatedFormObject : function(formObject){
		this.lastCreatedFormObject = formObject;
	}
}

