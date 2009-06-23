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
	fullWindowOverlayDiv : {},
	setFocusOnReady: false,
	
	build: function(focusOnReady) {
		if (this.fullWindowOverlayDiv != undefined)
		{
			this.fullWindowOverlayDiv.style.visibility = "hidden";
		}
		this.targetDiv.innerHTML = "";
		this.isUpdateable = false;
		if (focusOnReady != undefined) this.setFocusOnReady = focusOnReady;
		
		this.formObjectHolder = document.createElement("div");
		this.formObjectHolder.setAttribute("id", "formObjectHolder");
		this.targetDiv.appendChild(this.formObjectHolder);
		
		this.setSaveButtonVisibility(false);
		
		var saveButton = document.getElementById("saveButton");
		saveButton.innerHTML = "Save";
		
		this.controller.guiBuilder.renderButton(saveButton);
		var hook = this;
		saveButton.onclick = function() {
			var transport = hook.getData();
			var actionObject = {
				command: "SaveForm",
				formBuilder: hook,
				transport: transport
			};
			hook.controller.action(actionObject);
		}
		
		this.rootFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		this.rootFormObject.setOpenCoreObject(this.openCoreObject);
		this.rootFormObject.setParentUUID(this.parentUUID);
		this.rootFormObject.setTargetDiv(this.formObjectHolder);
		this.rootFormObject.setController(this.controller);
		this.rootFormObject.setFormBuilder(this);
		
		this.rootFormObject.build(true);
	},
	
	setSaveButtonVisibility : function(isVisible){
		var saveButtonElement = document.getElementById("saveButton");
		if (saveButtonElement != undefined) {
			saveButtonElement.style.visibility = isVisible == true ? "visible" : "hidden";
		}
	},
	
	finishLayout : function(formObject) {
		if(formObject!=undefined){
			if(formObject.isUpdateable!= undefined && formObject.isUpdateable == true) {
				this.isUpdateable = true;
				this.setSaveButtonVisibility(true);
			}
			var parameters = this.openCoreObject.getClassInfo().structure.parameters;
			if(parameters!=undefined){
				var i = 0;
				var j = 0;
				for(var key in parameters){
					var parameter = parameters[key];
					if(parameter.readOnly != undefined && parameter.readOnly == true){
						j++;
					}
					i++;
				}
			}
			if(i==j){
				this.setSaveButtonVisibility(false);	
			}
			if(formObject.parentFormObject!=undefined) {
				this.finishLayout(formObject.parentFormObject);
			}
		}
		
		// resetting formObjectHolders height for overflow
		var formObjectHolderElement = document.getElementById('formObjectHolder');
 		if (formObjectHolderElement == undefined) {
			formObjectHolderElement.style.height = parseInt(formObjectHolderElement.offsetHeight) + 'px';
			var mainAreaFormElement = document.getElementById('mainAreaForm');
			mainAreaFormElement.style.height = formObjectHolderElement.style.height;
		}
		
		if (this.setFocusOnReady == true) {
			this.setFocusOnReady = false;
			var e;
			if (this.openCoreObject.singleton == true) {
				e = $j("input")[1];
				if (e == undefined) e = $j("input")[0];
			} else {
				e = $j("input")[0];
			}
			if (e != undefined) e.focus();
		}
	},	
	
	setIsUpdateable : function(isUpdateable){
		this.isUpdateable = isUpdateable;
	},
	
	clean : function(){
		if (this.fullWindowOverlayDiv != undefined)
		{
			this.fullWindowOverlayDiv.style.visibility = "hidden";
		}
		this.targetDiv.innerHTML = "";	
		this.setSaveButtonVisibility(false);
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
	
	setFullWindowOverlayDivName : function(divName){
		var overlayDiv = document.getElementById(divName);
		if (overlayDiv != undefined) this.fullWindowOverlayDiv = overlayDiv;
	},
	
	setCurrentRootClassInstance: function(currentRootClassInstance){
		this.currentRootClassInstance = currentRootClassInstance;
	},
	
	setLastCreatedFormObject : function(formObject){
		this.lastCreatedFormObject = formObject;
	}
}

