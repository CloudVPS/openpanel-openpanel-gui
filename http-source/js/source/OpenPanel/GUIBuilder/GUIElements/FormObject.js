/**
 * @author jp
 */

 OpenPanel.GUIBuilder.GUIElements.FormObject = function(){
	this.guiBuilder;
	this.formBuilder;
	this.controller;
	this.isBuilt;
	
	this.parentFormObject;
	
	this.openCoreObject;
 	this.parentUUID = "";
	this.instances = [];
	this.currentInstance;
	this.currentMetaInstance;
	
	this.grid;
	this.fields;

	this.targetDiv;
	this.gridDiv;
	this.fieldsDiv;
	this.methodsDiv;
	this.buttonsDiv;
	this.childFormObjectsDiv;
	this.isUpdateable = false;
	this.childFormObjects = [];
	this.onChangeHandler;
	this.isLoading = false;
	this.formObjects;
	this.focusOnFirstField = false;
}
 
OpenPanel.GUIBuilder.GUIElements.FormObject.setGuiBuilder = function(guiBuilder){
	this.guiBuilder = guiBuilder;
}

OpenPanel.GUIBuilder.GUIElements.FormObject.prototype = {
  	
	build: function(focusOnFirstField){
		if(focusOnFirstField == true){
			this.focusOnFirstField = focusOnFirstField;
		}
		
		if (this.openCoreObject != undefined) {
			this.init();
			this.targetDiv.innerHTML = "";
			this.createDivs();
			
			if (this.openCoreObject.classInfo == undefined || (this.openCoreObject.classInfo != undefined && this.openCoreObject.classInfo.info == undefined) || (this.openCoreObject.classInfo.info != undefined && this.openCoreObject.classInfo.info.parent == undefined)) {
				this.createTopLevelForm();
			} else {
				this.createSubLevelFormAsync();
			}
		}
		this.isBuilt = true;
	},
	
	init : function(){
		// reset values
		this.childFormObjects = {};
	},
	
	createDivs : function(){
		this.gridDiv = document.createElement("div");
		this.gridDiv.setAttribute("id", this.openCoreObject.name + ":grid");
		this.gridDiv.setAttribute("class", "formGrid");
		
		if (this.openCoreObject.classInfo["class"].gridmargin != undefined) {
			var m = this.openCoreObject.classInfo["class"].gridmargin;
			this.gridDiv.style.marginTop = "" + m + "px";
		}
		
		this.targetDiv.appendChild(this.gridDiv);
		
		
		this.fieldsDiv = document.createElement("div");
		this.fieldsDiv.setAttribute("id", this.openCoreObject.name + ":fields");
		this.fieldsDiv.setAttribute("class", "formFields");
		
		this.targetDiv.appendChild(this.fieldsDiv);
		
		this.optionsDiv = document.createElement("div");
		this.optionsDiv.setAttribute("id", this.openCoreObject.name + ":options");
		this.optionsDiv.setAttribute("class", "formOptions");
		this.targetDiv.appendChild(this.optionsDiv);
		
		
		var anchorDiv = document.createElement("a");
		anchorDiv.setAttribute("name", this.openCoreObject.name);
		this.targetDiv.appendChild(anchorDiv);
		
		this.childFormObjectsDiv = document.createElement("div");
		this.childFormObjectsDiv.setAttribute("id", this.openCoreObject.name + ":childFormObjects");
		this.childFormObjectsDiv.setAttribute("class", "childFormObjects");
		this.targetDiv.appendChild(this.childFormObjectsDiv);
	},
	
	createTopLevelForm : function(){
		// is object
		if(this.parentFormObject == undefined){
			this.getRootFormObject().resetFormObjects();
		}
		this.getRootFormObject().startLoading(this);
		
		// first tab
		// do we need a rebuild?
		this.setCurrentInstance(this.controller.currentRootClassInstance);
		// is there an instance?
		if (this.currentInstance != undefined) {
			//console.log("there is an instance");
			if(this.isBuilt == true){
				var record = this.controller.dataManager.getRecord(this.openCoreObject.name, this.currentInstance.id);
				this.currentInstance = record[this.openCoreObject.name];
				
				this.openCoreObject.instances[this.currentInstance.id] = this.currentInstance;
				this.controller.currentRootClassInstance = this.currentInstance;
			}
			
			// UPDATE
			if (this.openCoreObject.canUpdate == true) {
				this.setIsUpdateable(true);
				// alright, now we can display these fields
				var targetDiv;
				if (this.openCoreObject.singleton == true && this.openCoreObject.canDelete == true) {
					//console.log("is singleton and can delete");
					targetDiv = document.createElement("div");
					targetDiv.setAttribute("style", "border: 1px solid #F00");
					targetDiv.appendChild(document.createTextNode("delete this object?"));
					this.fieldsDiv.appendChild(targetDiv);
				} else {
					//console.log("not singleton or can not delete");
					targetDiv = this.fieldsDiv;
					if (this.openCoreObject.singleton == false && this.openCoreObject.canDelete == false) {
					}
				}
				
				//console.log("create fields for " + this.openCoreObject.name + "  " + this.currentInstance.id);
				//console.log(this.currentInstance);
			} else {
				// not updateable yet able to show some info
				if (this.openCoreObject.singleton == true && this.openCoreObject.canDelete == true) {
					//console.log("is singleton and can delete");
					
					targetDiv = document.createElement("div");
					targetDiv.setAttribute("style", "border: 1px solid #F00");
					targetDiv.appendChild(document.createTextNode("delete this object?"));
					this.fieldsDiv.appendChild(targetDiv);
				} else {
					//console.log("not singleton or can not delete");
					targetDiv = this.fieldsDiv;
				}
			}
			
			this.createFields(this.openCoreObject, this.currentInstance, "", targetDiv);
			this.createMethods(this.openCoreObject);
				
			// DELETE
			if (this.openCoreObject.canDelete == true) {
				// we can delete this, however if it's a singleton it's hard to delete without item list
				if (this.openCoreObject.singleton == true) {
				// display a delete button
				}
			} else {
			// can't delete this, it's all fine
			}
		} else {
			if (this.openCoreObject.canCreate == true) {
				var msg = this.openCoreObject.classInfo["class"].emptytext;
				if (msg==undefined) msg = "No " + this.openCoreObject.title + " instances found";
				this.optionsDiv.appendChild(document.createTextNode(msg));
				this.createCreateOption(true);
			}
		}
		this.formBuilder.setIsUpdateable(false);
		this.getRootFormObject().doneLoading(this);
		this.formBuilder.finishLayout(this);
	},
	
	createSubLevelFormAsync : function createSubLevelFormAsync(stateObject){
		var state;
		var passThrough;
		
		
		if(stateObject!=undefined){
			if(stateObject.state != undefined){
				state = stateObject.state;
			}
			if(stateObject.passThrough != undefined){
				passThrough = stateObject.data;
			}
		}
		
		switch(state){
			case undefined:
				if(this.parentFormObject == undefined){
					this.getRootFormObject().resetFormObjects();
				}
				this.getRootFormObject().startLoading(this);
				
				this.openCoreObject.setHasFetchedInstances(false);
				this.openCoreObject.getInstancesByParentUUIDAsync(
					this.parentUUID, 
					this,
					"createSubLevelFormAsync", 
					{
						state: "getInstancesByParentUUIDDone"
					}
					);
			break;
			case "getInstancesByParentUUIDDone":
				

				
				this.instances = this.openCoreObject.instances;
				if (this.instances != undefined && typeof(this.openCoreObject.getFirstInstance()) == "object") {
				// there are instances
					
					var instance = this.getPreviousInstance();
					if (instance != undefined) {
						this.setCurrentInstance(instance);
					} else {
						this.setCurrentInstance(this.openCoreObject.getFirstInstance());
					}			
					// now we have to figure out if the current opencore object is a meta object
					var actualOpenCoreObject;
					var actualInstance;
					
					// get class name
					var className = this.currentInstance["class"];
					if (this.openCoreObject.name != className) {
						// get encapsulated object
						//console.log("className " + className, this.openCoreObject, this.controller.dataManager);
						actualOpenCoreObject = this.controller.dataManager.getOpenCoreObjectByName(className);
						// all good, now we have to find its instance
						var record = this.controller.dataManager.getRecord(actualOpenCoreObject.name, this.currentInstance.id);
						for(var key in record){
							this.currentMetaInstance = record[key];
							break;
						}
						// scary meta stuff						
						actualInstance = this.currentMetaInstance;
					} else {
						actualOpenCoreObject = this.openCoreObject;
						actualInstance = this.currentInstance;
					}
					
					if (actualOpenCoreObject.canUpdate == true) {
						this.setIsUpdateable(true);
					}
					
					
					if(actualOpenCoreObject.singleton == true){
						//console.log("singleton, create create and delete");
						if (actualOpenCoreObject.canDelete == true) {
							this.createCreateOption(false, true, this.fieldsDiv);
							
							var c = this.createDeleteOption();
                            var button = document.createElement("div");
                            button.update("Delete this " + this.openCoreObject.classInfo["class"].description + " instance");
                            this.controller.guiBuilder.GUIElements.Button.renderButton(button, undefined, true);
                            this.optionsDiv.appendChild(button);
                            button.onclick = c;
                        }
						
						this.childFormObjects = {};
						for(var childOpenCoreObjectName in actualOpenCoreObject.children){
							var childOpenCoreObject = actualOpenCoreObject.children[childOpenCoreObjectName];
							if (typeof(childOpenCoreObject) == "object") {
								
								//console.log(childOpenCoreObject);
								if (childOpenCoreObject.classInfo["class"].metabase == "") {
									// non meta stuff
									var someDiv = document.createElement("div");
									this.childFormObjectsDiv.appendChild(someDiv);
									if (typeof(childOpenCoreObject) == "object") {
										this.createChildFormObject(childOpenCoreObject, actualInstance.uuid, someDiv, this.controller);
									}
								}
							}
						}
					} else {
						// console.log("not singleton", this.openCoreObject.name);
						// not a singleton
						// the grid should always be displayed with non meta values
						// console.log("create Grid for " + this.openCoreObject.name);
						// console.log(this.instances);
							
						if (! this.openCoreObject.classInfo["class"].hidegrid) {
							this.createGrid(this.openCoreObject, this.instances, "callBackCommand", this.gridDiv, {}, this.currentInstance);
						} else {
							var c = this.createDeleteOption();
							var button = document.createElement("div");
							button.update("Delete this " + this.openCoreObject.classInfo["class"].description + " instance");
							this.controller.guiBuilder.GUIElements.Button.renderButton(button, undefined, true);
							
							this.optionsDiv.appendChild(button);
							
							button.onclick = c;
						}
						
						this.childFormObjects = {};
						for(var childOpenCoreObjectName in actualOpenCoreObject.children){
							var childOpenCoreObject = actualOpenCoreObject.children[childOpenCoreObjectName];
							if (typeof(childOpenCoreObject) == "object") {
								
								//console.log(childOpenCoreObject);
								if (childOpenCoreObject.classInfo["class"].metabase == "") {
									// non meta stuff
									var someDiv = document.createElement("div");
									this.childFormObjectsDiv.appendChild(someDiv);
									if (typeof(childOpenCoreObject) == "object") {
										this.createChildFormObject(childOpenCoreObject, actualInstance.uuid, someDiv, this.controller);
									}
								}
							}
						}
						
						if(this.openCoreObject.meta == true){
							// list objects
							this.createMultiCreateOption();
							
						} else {
							if (this.openCoreObject.canCreate == true) {
								this.createCreateOption(false);
							}
						}
						
						if(this.openCoreObject.meta == true){
							// list objects
							this.createDeleteOption();
						} else {
							if (this.openCoreObject.canDelete == true) {
								this.createDeleteOption();
							}
						}
						
						if(OpenPanel.GUIBuilder.getLastAnchor() == this.openCoreObject.name){
							OpenPanel.GUIBuilder.goToLastAnchor();
						}
					}
					
					this.createFields(actualOpenCoreObject, actualInstance, "", this.fieldsDiv);
					this.createMethods(actualOpenCoreObject);

					var formmargin = this.openCoreObject.classInfo["class"].formmargin;
					if (formmargin == undefined) formmargin = 0;
					
					this.fieldsDiv.style.marginTop = "" + formmargin + "px";
					
					
						
				} else {
					this.gridDiv.style.paddingTop = "15px";
			
					// no instances, show create new instance
					//console.log("no instances");
					var msg = this.openCoreObject.classInfo["class"].emptytext;
					if (msg==undefined) msg = "No objects found";
					
					if(this.openCoreObject.meta == true){
						// list objects
						this.optionsDiv.appendChild(document.createTextNode(msg));
						this.createMultiCreateOption(true);
					} else {

						
						
						var floater = document.createElement("div");
						floater.style.paddingTop = "8px";
						var textElement = document.createElement("div");
						textElement.style.marginBottom = "8px";
						textElement.appendChild(document.createTextNode(msg));
						floater.appendChild(textElement);
						this.optionsDiv.appendChild (floater);

						if (this.openCoreObject.canCreate == true) {
							this.createCreateOption(true, false, floater);
						}
					}
				}
				
				this.formBuilder.setIsUpdateable(false);
				this.formBuilder.finishLayout(this);
				this.getRootFormObject().doneLoading(this);
			break;
		}
	},
	
	getRootFormObject : function(){
		if(this.parentFormObject!=undefined){
			return this.parentFormObject.getRootFormObject();
		} else {
			return this;
		}
	},
	
	startLoading : function(formObject){
		this.isLoading = true;
		if(this.formObjects == undefined) this.resetFormObjects();
		var has = false;
		for(var i=0;i<this.formObjects.length;i++){
			if(this.formObjects[i].openCoreObject.name == formObject.openCoreObject.name){
				has = true;
				continue;
			}
		}
		
		if(has == false){
			this.formObjects.push(formObject);
		}
	},

	doneLoading : function(formObject){
		if(this.formObjects == undefined) this.resetFormObjects();
		for(var i = 0;i<this.formObjects.length;i++){
			if(this.formObjects[i].openCoreObject.name == formObject.openCoreObject.name){
				this.formObjects.splice(i, 1);
			}
		}
		
		if(this.formObjects.length == 0){
			this.isLoading = false;
		}
	},
	
	
	resetFormObjects : function(){
		this.formObjects = new Array();	
	},

	setIsUpdateable : function(isUpdateable){
		this.isUpdateable = isUpdateable;
	},
	
	createMultiCreateOption : function(textOnly){
		if ((textOnly==undefined)||(textOnly==false)){
			this.createMultiCreateOptionOld();
			return;
		}
		
		var metaObjects = this.controller.dataManager.getOpenCoreObjectsByMetaName(this.openCoreObject.name);

		var available = {};
		var canAdd = false;
		var canAdds = {};
		
		for(var i = 0;i<metaObjects.length;i++){
			var metaObject = metaObjects[i];
			// get quota, compare, etc
			canAdds[metaObject.name] = this.controller.dataManager.checkQuotum(metaObject.name);
			if(this.controller.dataManager.checkQuotum(metaObject.name)){
				available[metaObject.classInfo["class"].sortindex + "_" + metaObject.name] = metaObject;
				canAdd = true;
			}
		}
		
		var tB = document.createElement("div");
		
		tB.style.paddingTop = "10px";
		
		
		if (canAdd == true) {
			var availableKeys = [];
			
			for (var key in available) {
				availableKeys.push(key);
			}
			
			availableKeys.alphanumSort(true);
			
			for(var i = 0;i<availableKeys.length;i++){
			    var key = availableKeys[i];
			    var metaObject = available[key];
				var tD = document.createElement ("div");
				   
				tD.style.paddingRight = "10px";
				tD.style.float = "left";
				var bdiv = document.createElement("div");
				bdiv.innerHTML = "Set Up " + metaObject.title;
				this.controller.guiBuilder.GUIElements.Button.renderButton(bdiv,false,true);

				bdiv.openCoreObject = metaObject;
				var hook = this;
				bdiv.onclick = function(){
						hook.controller.action({
							command: "ShowCreateInstanceFromFormObjectMeta",
							formObject: hook,
							openCoreObject: this.openCoreObject,
							parentUUID: hook.parentUUID,
							formObjectHolder: hook.formBuilder.formObjectHolder
						});
					}
				tD.appendChild(bdiv);
				tB.appendChild(tD);
			}
			var tD = document.createElement ("div");
            
            tD.style.clear = "both";
            tB.appendChild(tD);
			this.optionsDiv.appendChild(tB);
		}
	},
	
	createMultiCreateOptionOld : function(){
		var metaObjects = this.controller.dataManager.getOpenCoreObjectsByMetaName(this.openCoreObject.name);
		var available = {};
		var canAdd = false;
		var canAdds = {};
		if (this.grid != undefined) {
		
			for (var i = 0; i < metaObjects.length; i++) {
				var metaObject = metaObjects[i];
				// get quota, compare, etc
				canAdds[metaObject.name] = this.controller.dataManager.checkQuotum(metaObject.name);
				if (this.controller.dataManager.checkQuotum(metaObject.name)) {
					available[metaObject.classInfo["class"].sortindex + "_" + metaObject.name] = metaObject;
					canAdd = true;
				}
			}
			
			if (canAdd == true) {
				function mkcallback(hook, openCoreObject){
					return function(){
						if (openCoreObject != undefined) {
							hook.controller.action({
								command: "ShowCreateInstanceFromFormObjectMeta",
								formObject: hook,
								openCoreObject: openCoreObject,
								parentUUID: hook.parentUUID,
								formObjectHolder: hook.formBuilder.formObjectHolder
							});
						}
					}
				}
				
				var mdef = {};
				var availableKeys = [];
				
				for (var key in available) {
					availableKeys.push(key);
				}
				
				availableKeys.alphanumSort(true);
				
				for(var i = 0;i<availableKeys.length;i++){
					var key = availableKeys[i];
					var metaObject = available[key];
					var menukey = "Create " + metaObject.title;
					mdef[menukey] = mkcallback(this, metaObject);
				}
				
				this.setGridMenu(mdef);
			}
		}
	},
	
	createCreateOption : function (textOnly, displayOnly, targetDiv){
		// does not support meta stuff
			
		if (this.openCoreObject.meta == true) {
		
		} else {
			if (this.controller.dataManager.checkQuotum(this.openCoreObject.name) == true) {
				var hook = this;
				var createfunc;
				
				if(this.openCoreObject.parent.name == "ROOT"){
					createfunc = function() {
						hook.controller.action({
							command : "ShowCreateInstanceFromItemList", 
							
							openCoreObject: hook.openCoreObject,
							
							formObjectHolder: hook.formBuilder.formObjectHolder
						});
					}
				} else {
					createfunc = function() {
						hook.controller.action({
							command: "ShowCreateInstanceFromFormObject",
							formObject: hook,
							openCoreObject: hook.openCoreObject,
							parentUUID: hook.parentUUID,
							formObjectHolder: hook.formBuilder.formObjectHolder
						});
					}
				}
				
				var createOne;
				if (textOnly == true) {
				    /*
					var expln = this.openCoreObject.classInfo["class"].explanation;
					if((expln != undefined)&&(expln != "")){
					   
					    var explanationElement = document.createElement("div");
						explanationElement.className = "explanation";
						explanationElement.innerHTML = "<br>"+expln;
						this.optionsDiv.appendChild(explanationElement);
					}	
                    */
					createOne = document.createElement("div");
					if (targetDiv == undefined) createOne.style.paddingTop = "10px";
					createOne.innerHTML = "Set Up " + this.openCoreObject.title;
					this.controller.guiBuilder.GUIElements.Button.renderButton(createOne,false,true);

					if (displayOnly == undefined || displayOnly == false) {
						createOne.onclick = createfunc;
					}
					if(targetDiv == undefined){
						this.gridDiv.appendChild(createOne);
					} else {
						targetDiv.appendChild(createOne);
					}
					createOne.openCoreObject = this.openCoreObject;
					// quota debug stuff
					q = document.createElement("ul");
					createOne.appendChild(q);

				} else {
					if (this.grid != undefined) this.grid.setCreateCallback(createfunc);
				}
				
				/*
				var quotum = this.controller.dataManager.getQuotumByClassName(this.openCoreObject.name);
				if (quotum != undefined) {
					var li = document.createElement("li");
					li.appendChild(document.createTextNode(">>quotum : " + this.openCoreObject.name + " " + quotum.quota));
					q.appendChild(li);
				}
				*/
			}
		}
	},
	
	createDeleteOption : function (targetDiv){
		var hook = this;
		var callbackfunc = function(){
			hook.controller.action({
				command : "ShowDeleteInstanceFromFormObject",
				formObject : hook,
				openCoreObject:hook.openCoreObject,
				parentUUID: hook.parentUUID,
				formObjectHolder : hook.formBuilder.formObjectHolder
			});
		}
			
		if (this.grid != undefined) this.grid.setDeleteCallback (callbackfunc);
		
		return callbackfunc;
	},
	
	getPreviousInstance: function(){
		var previousInstanceName = this.formBuilder.getInstance(this.openCoreObject.name);
		var previousInstance = this.instances[previousInstanceName];
		if(previousInstance!= undefined){
			return previousInstance;
		}
	},
	
	setCurrentInstance : function(instance){
		
		if (instance != undefined) {
			this.currentInstance = instance;
			this.openCoreObject.setCurrentInstance(instance);
			//this.openCoreObject.currentInstance = instance;
			this.formBuilder.setCurrentInstance(this.openCoreObject.name, instance.id);
		}
	},
	
	getData : function(transport){
		//console.log("getData " + this.openCoreObject.name);
		var actualOpenCoreObject;
		var actualInstance;
		
		if(this.openCoreObject.meta == true){
			if (this.currentMetaInstance != undefined && this.currentMetaInstance["class"] != undefined) {
				actualOpenCoreObject = this.controller.dataManager.getOpenCoreObjectByName(this.currentMetaInstance["class"]);
				actualInstance = this.currentMetaInstance;
			}
		} else{
			actualOpenCoreObject = this.openCoreObject;
			actualInstance = this.currentInstance;
		}
		
		if(actualOpenCoreObject!= undefined && actualOpenCoreObject.canUpdate == true){
			var formData = this.getFormData();
			
			if (formData != undefined) {
				//console.log(formData);
				transport.push({
					openCoreObject: actualOpenCoreObject,
					formData: formData,
					instance: actualInstance
				})
			}
		}
		
		for(var key in this.childFormObjects){
			var childFormObject = this.childFormObjects[key];
			if (typeof(childFormObject) == "object") {
				childFormObject.getData(transport);
			}
		}
	},
	
	getFormData : function(){
		if (this.fields != undefined && this.fields.getFormValues != undefined) {
			
			var r = this.fields.getFormValues();
			return r;
		}
	},
	
	createFields : function(openCoreObject, instance, callBackCommand, targetDiv, optionalCallBackObject){
		this.fields = new OpenPanel.GUIBuilder.GUIElements.FormFields();	
		this.fields.setTargetDiv(targetDiv);
		this.fields.setOpenCoreObject(openCoreObject);
		this.fields.setFormObject(this);
		this.fields.setInstance(instance);
		
		if(optionalCallBackObject == undefined){
			optionalCallBackObject = {};
		}
		this.fields.setCallBackCommand(callBackCommand, optionalCallBackObject);
		
		if(this.onChangeHandler!=undefined){
			this.fields.setOnChangeHandler(this.onChangeHandler);
		}
		this.fields.build();
	},
	
	createMethods : function(openCoreObject){
		// for now creation of this stuff stays here
		// iterate list
		// create buttons
		// have buttons call same method
		
		// something different happening here: divs are *not* create beforehand
		if (openCoreObject.classInfo.structure.methods != "") {
			this.methodsDiv = document.createElement("div");
			this.methodsDiv.setAttribute("id", this.openCoreObject.name + ":methods");
			this.methodsDiv.setAttribute("id", "methods");
			this.optionsDiv.appendChild(this.methodsDiv);
			var fieldContainerGroup = window.OpenPanel.GUIBuilder.drawGroup();
			
			var groupHolder = fieldContainerGroup.groupHolder;
			var contentDiv = fieldContainerGroup.contentDiv;
			this.methodsDiv.appendChild(groupHolder);
			
			var methods = openCoreObject.classInfo.structure.methods;
			var hook = this;
			
			for (var key in methods) {
				var knopje = document.createElement("div");
				knopje.innerHTML = methods[key].description;
				this.controller.guiBuilder.GUIElements.Button.renderButton(knopje,false,true);

				contentDiv.appendChild(knopje);
				knopje.onclick = function(){
					hook.controller.action( 
						{ 
							command : "InvokeMethod",
							openCoreObject : openCoreObject,
							methodName : key
						})
					}
			}
		}
	},
	
	createSaveButton : function(){
		var hook = this;
		saveButton = document.createElement("div");
		saveButton.setAttribute ("id", "modalSaveButton");
		saveButton.style.cssText = "float: right;padding-top: 11px; padding-left:12px;";
		saveButton.appendChild(document.createTextNode("Create"));
		saveButton.onclick = function(){
			OpenPanel.KeyboardHandler.clearCancel();
			OpenPanel.KeyboardHandler.clearOk();
			hook.fields.submit();
		}
		this.controller.guiBuilder.GUIElements.Button.renderButton(saveButton,true);

		
		return saveButton;
	},
	
	createDisabledSaveButton : function(){
		var saveButton = document.createElement("div");
		saveButton.setAttribute ("id", "modalDisabledSaveButton");
		saveButton.style.cssText = "float: right;padding-top: 11px; padding-left:12px;";
		saveButton.appendChild(document.createTextNode("Create"));
		this.controller.guiBuilder.renderDisabledButton(saveButton, true);
		return saveButton;
	},
	
	createModalFields : function(openCoreObject, instance, callBackCommand, targetDiv, optionalCallBackObject){
		
		this.fields = new OpenPanel.GUIBuilder.GUIElements.FormFields();
		this.fields.setTargetDiv(targetDiv);
		this.fields.setOpenCoreObject(openCoreObject);
		this.fields.setFormObject(this);
		this.fields.setInstance(instance);
		this.fields.setIsCreate(true);
		this.fields.setZIndex(10000);
		this.fields.setController(this.controller);
		if(this.onChangeHandler!=undefined){
			this.fields.setOnChangeHandler(this.onChangeHandler);
		}
		
		
		var hook = this;
		var f = function(formElement){
			var p = $("modalSaveButtonHolder");
			if(p){
				if(hook.fields.formPanel.validate()){
					$("modalSaveButton").show();
					$("modalDisabledSaveButton").hide();
				} else {
					$("modalSaveButton").hide();
					$("modalDisabledSaveButton").show();
				}
			}
		}
		
		this.fields.setOnChangeHandler(f);
		
		if(optionalCallBackObject == undefined){
			optionalCallBackObject = {};
		}
		
		this.fields.setCallBackCommand(callBackCommand, optionalCallBackObject);
		this.fields.build(true);
		var modalSaveButtonHolder = document.createElement("div");
		modalSaveButtonHolder.setAttribute("id", "modalSaveButtonHolder");
		targetDiv.appendChild(modalSaveButtonHolder);
		var saveButton = document.createElement("div");
		var cancelButton = document.createElement("div");
		var hook = this;
		
		var saveButton = this.createSaveButton();
		var saveButtonDisabled = this.createDisabledSaveButton();
			
		modalSaveButtonHolder.appendChild(saveButton);
		modalSaveButtonHolder.appendChild(saveButtonDisabled);
		saveButtonDisabled.hide();
		
		f();
			
		var d = cancelButton;
		d.setAttribute ("id", "modalCancelButton");
		d.style.cssText = "float: right;padding-top: 11px;";
		d.appendChild(document.createTextNode("Cancel"));
		d.onclick = function(){
			OpenPanel.KeyboardHandler.clearCancel();
			OpenPanel.KeyboardHandler.clearOk();
			saveButton.style.opacity = "0.50";
			cancelButton.style.opacity = "0.50";
			hook.fields = undefined;
			OpenPanel.GUIBuilder.deletePopUp();
			this.setAttribute("disabled", "true");
			this.style.opacity = "0.5";
			this.onclick = function(){ };
			//targetDiv.parentNode.parentNode.removeChild(targetDiv.parentNode);
		}
		this.controller.guiBuilder.GUIElements.Button.renderButton(d);

		targetDiv.appendChild(d);
		
		var cancelButton = d;
		
		var clearDiv = document.createElement("div");
		clearDiv.style.cssText = "clear:both;";
		targetDiv.appendChild(clearDiv);
		
		if(this.parentFormObject == undefined){
			this.fields.formPanel.focusOnFirstField();
		}
		
		OpenPanel.KeyboardHandler.setCancel (function(){
			var b = cancelButton.childNodes[0];
			if (b!=undefined) b.onmousedown();
			setTimeout (function() {
				hook.fields = undefined;
				OpenPanel.KeyboardHandler.clearOk();
				OpenPanel.KeyboardHandler.clearCancel();
				OpenPanel.GUIBuilder.deletePopUp();
			},50);
		});
		
		OpenPanel.KeyboardHandler.setOk (function(){
			var isValid = hook.fields.formPanel.validate();
			if(isValid === true){
				//OpenPanel.KeyboardHandler.clearOk();
				//OpenPanel.KeyboardHandler.clearCancel();
				hook.fields.submit();
			}
		});
	},
	
	
	
	setGridMenu : function(mdef) {
		this.grid.setMenu(mdef);
	},
	
	createGrid : function(openCoreObject, instances, callBackCommand, targetDiv, optionalCallBackObject, instance){
		this.grid = new OpenPanel.GUIBuilder.GUIElements.FormGrid();	
		this.grid.setTargetDiv(targetDiv);
		this.grid.setOpenCoreObject(openCoreObject);
		this.grid.setFormObject(this);
		this.grid.setInstances(instances);
		this.grid.setInstance(instance);
		if(optionalCallBackObject == undefined){
			optionalCallBackObject = {};
		}
		this.grid.setCallBackCommand(callBackCommand, optionalCallBackObject);
		this.grid.build();
	},
	
	clickGridItem : function(instance){
		this.controller.action({
			command : "ClickGridItem",
			formObject : this,
			instance : instance	
		})
	},
	
	createChildFormObject : function(openCoreObject, parentUUID, targetDiv, controller){
		var childFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		// this.childFormObjects.push(childFormObject);
		childFormObject.setOpenCoreObject(openCoreObject);
		childFormObject.setParentFormObject(this);
		childFormObject.setParentUUID(parentUUID);
		childFormObject.setTargetDiv(targetDiv);
		childFormObject.setController(controller);
		childFormObject.setFormBuilder(this.formBuilder);
		childFormObject.setOnChangeHandler(this.onChangeHandler);
		childFormObject.build();
		
		this.childFormObjects[openCoreObject.name] = childFormObject;
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;
	},
	
	setOnChangeHandler : function(onChangeHandler){
		this.onChangeHandler = onChangeHandler;
	},
	
	setParentUUID : function(parentUUID){
		this.parentUUID = parentUUID;
	},
	
	setTargetDiv : function(targetDiv){
		this.targetDiv = targetDiv;
	},
	
	setController : function(controller){
		this.controller = controller;
	},
	
	setFormBuilder : function(formBuilder){
		this.formBuilder = formBuilder;	
		this.formBuilder.setLastCreatedFormObject(this);
	},
	
	updateInstance: function(openCoreObject, instance, formData){ },
	
	createCreatePopUp : function(targetDiv, callBack){
		var popUpDiv = this.guiBuilder.createPopUp();
	},
	
	setParentFormObject : function(foo){
		this.parentFormObject = foo;
		
	},
	
	onChange : function(forms){
		//console.log('--------', forms);
		for(var key in forms){
			//console.log(forms[key].hasChanged());
		}
	},
	
	getRootFormObject : function(){
		if(this.parentFormObject!=undefined){
			return this.parentFormObject.getRootFormObject();
		} else {
			return this;
		}
	},
	
	getAllFormElements : function(formElements){
		if(formElements==undefined) formElements = new Array();
		if(this.fields!=undefined){
			this.fields.formPanel.formElements.each(function(formElement){ formElements.push(formElement)});
			for(var key in this.childFormObjects){
				this.childFormObjects[key].getAllFormElements(formElements);
			}
		}
		return formElements;
	}
}