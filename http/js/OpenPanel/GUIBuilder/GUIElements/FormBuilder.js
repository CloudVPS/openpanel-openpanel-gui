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
	FOCUS_FORM: 1,
	FOCUS_ITEMLIST: 2,
	setFocusOnReady: 0,
	
	build: function() {
		if (this.fullWindowOverlayDiv != undefined)
		{
			this.fullWindowOverlayDiv.style.visibility = "hidden";
		}
		this.targetDiv.innerHTML = "";
		this.isUpdateable = false;
		
		this.formObjectHolder = document.createElement("div");
		this.formObjectHolder.setAttribute("id", "formObjectHolder");
		this.targetDiv.appendChild(this.formObjectHolder);
		
		this.setSaveButtonVisibility(false);
		
		var saveButton = document.getElementById("saveButton");
		saveButton.innerHTML = "Save";
		var hook = this;
		this.controller.guiBuilder.renderButton(saveButton, undefined, undefined, false);
		//this.createSaveButtonAction(saveButton);
		
		this.rootFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		this.rootFormObject.setOpenCoreObject(this.openCoreObject);
		this.rootFormObject.setParentUUID(this.parentUUID);
		this.rootFormObject.setTargetDiv(this.formObjectHolder);
		this.rootFormObject.setController(this.controller);
		this.rootFormObject.setFormBuilder(this);
		this.rootFormObject.setOnChangeHandler(function(that){hook.onChangeHandler(that)});
		this.v = new Array();
		this.rootFormObject.build(true);
	},
	
	createSaveButtonAction : function(saveButton){
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
	},
	
	removeSaveButtonAction : function(saveButton){
		saveButton.onclick = function(){};
	},
	
	onChangeHandler : function(formElement){
		//console.log("this.rootFormObject", this.rootFormObject.isLoading);
		if(this.v == undefined) this.v = new Array();
		if(formElement.initialValue != formElement.value){
			//console.log(formElement.name + "-" + formElement.initialValue + "-" + formElement.value + ".");
			var c = false;
			for (var i = 0; i < this.v.length; i++) {
				if (this.v[i] == formElement.name) {
					c = true;
				}			
			}
			
			if (c == false) {
				this.v.push(formElement.name);
			}
		} else {
			for(var i = 0;i<this.v.length;i++){
				if(this.v[i] == formElement.name){
					this.v.splice(i,1);
				}
			}
		}
		this.setSaveButtonActive(this.v.length!=0);
	},
	
	setSaveButtonActive : function(isActive){
		if(isActive == true){
			var saveButton = document.getElementById("saveButton");
			saveButton.innerHTML = "Save";
			this.controller.guiBuilder.renderButton(saveButton);
			this.createSaveButtonAction(saveButton);
		} else {
			var saveButton = document.getElementById("saveButton");
			saveButton.innerHTML = "Save";
			this.controller.guiBuilder.renderDisabledButton(saveButton);
		}
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
				this.setSaveButtonActive(false);
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
				this.setSaveButtonActive(false);	
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

