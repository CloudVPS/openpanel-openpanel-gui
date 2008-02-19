/**
 * @author jp
 */

 OpenPanel.GUIBuilder.GUIElements.FormObject = function(){
	this.openCoreObject;
 	this.parentUUID = "";
	this.instances = [];
	this.targetDiv;
	this.fields;
	this.fieldsDiv;
	this.grid;
	this.gridDiv;
	this.controller;
	this.buttonsDiv;
	this.guiBuilder;
	this.currentInstance;
	this.currentMetaInstance;
	this.childFormObjects = {};
	this.childFormObjectsDiv;
	this.parentFormObject;
	this.isBuilt;
 }
 
OpenPanel.GUIBuilder.GUIElements.FormObject.setGuiBuilder = function(guiBuilder){
	this.guiBuilder = guiBuilder;
}
	
 
OpenPanel.GUIBuilder.GUIElements.FormObject.prototype = {
  	
	build: function(){
	  	this.childFormObjects = {};
		this.targetDiv.innerHTML = "";
		this.targetDiv.setAttribute("class", "FormObject");
		
		var nameDiv = document.createElement("div");
		nameDiv.innerHTML = "FormObject " + this.openCoreObject.name;
		nameDiv.setAttribute("class", "nameDiv");
		
		this.targetDiv.appendChild(nameDiv);
		
		this.gridDiv = document.createElement("div");
		this.gridDiv.setAttribute("id", this.openCoreObject.name + ":grid");
		this.targetDiv.appendChild(this.gridDiv);
		
		this.fieldsDiv = document.createElement("div");
		this.fieldsDiv.setAttribute("id", this.openCoreObject.name + ":fields");
		this.targetDiv.appendChild(this.fieldsDiv);
		
		this.childFormObjectsDiv = document.createElement("div");
		this.childFormObjectsDiv.setAttribute("id", this.openCoreObject.name + ":childFormObjects");
		this.childFormObjectsDiv.setAttribute("class", "childFormObjects");
		this.targetDiv.appendChild(this.childFormObjectsDiv);
		
		//this.currentInstance = undefined;
		
		var msg = "";
		if(this.openCoreObject != undefined && this.parentUUID != ""){
			var className = this.openCoreObject.name;
				
			if (this.openCoreObject.classInfo.info.parent == undefined) {
				console.log("first tab " + this.openCoreObject.name);
				// first tab
				// do we need a rebuild?
				
				if(this.currentInstance == undefined){
					// no, get it from the controller
					this.currentInstance = this.controller.currentRootClassInstance;
				} else {
					// yes, apparently we have to rebuild
					console.log('rebuild');
					
					var record = this.controller.dataManager.getRecord(this.openCoreObject.name, this.currentInstance.id);
					this.currentInstance = record[this.openCoreObject.name];
					this.openCoreObject.instances[this.currentInstance.id] = this.currentInstance;
				}
				
				// is there an instance?
				if(this.currentInstance!=undefined){
					console.log("there is an instance");
					// UPDATE
					if(this.openCoreObject.canUpdate == true){
						console.log("can update");
						// alright, now we can display these fields
						var targetDiv;
						if(this.openCoreObject.singleton == true && this.openCoreObject.canDelete == true){
							console.log("is singleton and can delete");
							targetDiv = document.createElement("div");
							targetDiv.setAttribute("style", "border: 1px solid #F00");
							targetDiv.appendChild(document.createTextNode("delete this object?"));
							this.fieldsDiv.appendChild(targetDiv);
						} else {
							console.log("not singleton or can not delete");
							targetDiv = this.fieldsDiv;
						}
						
						console.log("create fields for " + this.openCoreObject.name + "  " + this.currentInstance.id);
						console.log(this.currentInstance);
						this.createFields(this.openCoreObject, this.currentInstance, "updateRootInstance", targetDiv);
						
					} else if(this.openCoreObject.canGetInfo == true) {
						console.log("can not update");
						// not updateable yet able to show some info
						if(this.openCoreObject.singleton == true && this.openCoreObject.canDelete == true){
							console.log("is singleton and can delete");
							
							targetDiv = document.createElement("div");
							targetDiv.setAttribute("style", "border: 1px solid #F00");
							targetDiv.appendChild(document.createTextNode("delete this object?"));
							this.fieldsDiv.appendChild(targetDiv);
						} else {
							console.log("not singleton or can not delete");
							targetDiv = this.fieldsDiv;
						}
						
						this.createFields(this.openCoreObject, this.currentInstance, function(){}, targetDiv);
						// this.fields.lock();
					} else {
						// nothing goes from here, there's nothing here to see
					}
					
					// DELETE
					if(this.openCoreObject.canDelete == true){
						// we can delete this, however if it's a singleton it's hard to delete without item list
						if(this.openCoreObject.singleton == true){
							// display a delete button
						}
					} else {
						// can't delete this, it's all fine
					}
					
				} else {
					// CREATE
					// no instance, can we create one?
					
					if(this.openCoreObject.canCreate == true){
						// we can, how do we create it? in the item list to the left or can there only be one instance?
						if(this.openCoreObject.singleton == true){
							// there can be only one instance, no item list involved, let's just display a create button
						} else {
							// there can be more than one instance, nonetheless show our create button
						}
					} else {
						// can't create anything
					}
				}
				
				
			} else {
				console.log("not first tab  " + this.openCoreObject.name);
				this.openCoreObject.setHasFetchedInstances(false);
				this.instances = this.openCoreObject.getInstancesByParentUUID(this.parentUUID);
				console.log("this");
				console.log(this);
				console.log("this.currentInstance");
				console.log(this.currentInstance);
				if (this.instances != undefined && typeof(this.openCoreObject.getFirstInstance()) == "object") {
					// there are instances
					console.log("this.currentInstance2");
					console.log(this.currentInstance);
					if (this.currentInstance == undefined) {
						console.log("currentInstance undefined");
						this.currentInstance = this.openCoreObject.getFirstInstance();
					} else {
						
						
						var metaid = this.currentInstance.metaid;
						console.log("rebuild metaid " + metaid);
						console.log(this.instances);
						if(this.instances[metaid] != undefined){
							// this means we are running build() again
							console.log(this.openCoreObject.name + " rebuild");
							this.currentInstance = this.instances[metaid];
						} else {
							this.currentInstance = this.openCoreObject.getFirstInstance();
						}
					}
					
					// now we have to figure out if the current opencore object is a meta object
					
					console.log("before : " + this.openCoreObject.name);
					// meta class roundtrip, is this in the right place?
					var actualOpenCoreObject;
					var actualInstance;

					// get class name
					var className = this.currentInstance["class"];
					if (this.openCoreObject.name != className) {
						// get encapsulated object
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
					
					console.log("after : " + actualOpenCoreObject.name);
					console.log("currentInstance");
					console.log(this.currentInstance);
					if(actualOpenCoreObject.singleton == true){
						console.log("singleton");
						// show fields
						this.createFields(actualOpenCoreObject, actualInstance, "asdasd", this.fieldsDiv);
					} else {
						console.log("not singleton");
						// not a singleton
						// the grid should always be displayed with non meta values
						this.createGrid(this.openCoreObject, this.instances, "callBackCommand", this.gridDiv, {});
						// here's where we have to check for meta stuff
						this.createFields(actualOpenCoreObject, actualInstance, "no command", this.fieldsDiv);
						
						for(var childOpenCoreObjectName in actualOpenCoreObject.children){
							
							var childOpenCoreObject = actualOpenCoreObject.children[childOpenCoreObjectName];
							if (typeof(childOpenCoreObject) == "object") {
								
								console.log(childOpenCoreObject);
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
						//this.createFields(this.openCoreObject, this.controller.currentRootClassInstance, "updateRootInstance", targetDiv);
					}
				}
				else {
					// no instances, show create new instance
					console.log("no instances");
					var msg = "no instances for " + this.openCoreObject.name;
					if (this.openCoreObject.canCreate == true) {
						msg+= "create one?"
					}
					this.gridDiv.innerHTML = msg;
				}
			}
		} else {
			// no parent id
			console.log("NO PARENT ID");
		}
		
		this.isBuilt = true;
		
	},
	
	getData : function(transport){
		console.log("getData " + this.openCoreObject.name);
		var actualOpenCoreObject;
		var actualInstance;
		
		if(this.openCoreObject.meta == true){
			actualOpenCoreObject = this.controller.dataManager.getOpenCoreObjectByName(this.currentMetaInstance["class"]);
			actualInstance = this.currentMetaInstance;
		} else{
			actualOpenCoreObject = this.openCoreObject;
			actualInstance = this.currentInstance;
		}
		
		if(actualOpenCoreObject.canUpdate == true){
			console.log("hi");
			var formData = this.getFormData();
			
			if (formData != undefined) {
				console.log(formData);
				transport.push({
					openCoreObject: actualOpenCoreObject,
					formData: formData,
					instance: actualInstance
				})
			}
		}
		
		for(var key in this.childFormObjects){
			var childFormObject = this.childFormObjects[key];
			console.log("child: " + childFormObject.openCoreObject.name);
			childFormObject.getData(transport);
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
		this.fields.build();
	},
	
	createGrid : function(openCoreObject, instances, callBackCommand, targetDiv, optionalCallBackObject){
		
		this.grid = new OpenPanel.GUIBuilder.GUIElements.FormGrid();	
		this.grid.setTargetDiv(targetDiv);
		this.grid.setOpenCoreObject(openCoreObject);
		this.grid.setFormObject(this);
		this.grid.setInstances(instances);
		if(optionalCallBackObject == undefined){
			optionalCallBackObject = {};
		}
		this.grid.setCallBackCommand(callBackCommand, optionalCallBackObject);
		this.grid.build();
	},
	
	clickGridItem : function(instance){
		// fill form
		console.log("clickGridItem " + instance["class"] + this.openCoreObject.name);
		var actualInstance;
		this.currentInstance = instance;
		
		if (this.openCoreObject.meta == true) {
			console.log("ismeta");
			var record = this.controller.dataManager.getRecord(instance["class"], instance.id);
			for(var className in record){
				instance = record[className];
			}
			if (instance != undefined) {
				console.log("is not undefined");
				console.log(instance);
				this.currentMetaInstance = instance;
				actualInstance = instance;
			} else {
				// errors here
			}
		} else {
			this.currentInstance = instance;
			actualInstance = instance;
		}
		
		var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(actualInstance["class"]);
		console.log("clickGridItem2 " + openCoreObject.name);
		
		
		this.createFields(openCoreObject, actualInstance, "callBackCommand", this.fieldsDiv, {});
		// create childFormObjects
		this.childFormObjectsDiv.innerHTML = "";
		for (var childOpenCoreObjectName in openCoreObject.children) {
		
			var childOpenCoreObject = openCoreObject.children[childOpenCoreObjectName];
			
			var someDiv = document.createElement("div");
			this.childFormObjectsDiv.appendChild(someDiv);
			if (typeof(childOpenCoreObject) == "object" && childOpenCoreObject.classInfo["class"].metabase == "") {
				this.createChildFormObject(childOpenCoreObject, actualInstance.uuid, someDiv, this.controller);
			}
		}
	},
	
	
	createChildFormObject : function(openCoreObject, parentUUID, targetDiv, controller){
		
		childFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		childFormObject.setOpenCoreObject(openCoreObject);
		
		childFormObject.setParentUUID(parentUUID);
		childFormObject.setTargetDiv(targetDiv);
		childFormObject.setController(controller);
		childFormObject.build();
		
		this.childFormObjects[openCoreObject.name] = childFormObject;
		
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;
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
	
	updateInstance: function(openCoreObject, instance, formData){
		console.log(this.openCoreObject.name);
		console.log(formData);
	},
	
	updateRootInstance: function(openCoreObject, instance, formData){
		console.log(this.openCoreObject.name);
		console.log(this);
		this.controller.action("updateRootInstance", {
			openCoreObject : openCoreObject,
			instance : instance,
			formData : formData
		});
	},
	
	createCreatePopUp : function(targetDiv, callBack){
		var popUpDiv = this.guiBuilder.createPopUp();
	},
	
	setFormBuilder : function(formBuilder){
		this.formBuilder = formBuilder;
	}
	
  }
 
 
