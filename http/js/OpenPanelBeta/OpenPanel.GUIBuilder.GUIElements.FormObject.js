/**
 * @author jp
 */

 OpenPanel.GUIBuilder.GUIElements.FormObject = function(){
	this.guiBuilder;
	this.formBuilder;
	this.controller;
	this.isBuilt;
	
	this.parentFormObject;
	this.childFormObjects = {};
	
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
	this.buttonsDiv;
	this.childFormObjectsDiv;
 }
 
OpenPanel.GUIBuilder.GUIElements.FormObject.setGuiBuilder = function(guiBuilder){
	this.guiBuilder = guiBuilder;
}
	
 
OpenPanel.GUIBuilder.GUIElements.FormObject.prototype = {
  	
	build: function(){
		// divs maken
		if (this.openCoreObject != undefined) {
			this.init();
			this.targetDiv.innerHTML = "";
			this.createDivs();
			if (this.openCoreObject.classInfo == undefined || (this.openCoreObject.classInfo.info != undefined && this.openCoreObject.classInfo.info.parent == undefined)) {
				this.createTopLevelForm();
			} else {
				this.createSubLevelForm();
			}
		}
		// is toplevel object?
		// 		ja
		//			pak dan instance van controller
		//		nee
		//			pak dan parentUUID, haal instances
		//			selecteer juiste instance
		//			teken formfields
		//			teken grid
		//			instantieer nieuwe childobjects met juiste instance
		
	  	this.isBuilt = true;
		console.log(" ");
	},
	
	init : function(){
		// reset values
		this.childFormObjects = {};
	},
	
	createDivs : function(){
		var nameDiv = document.createElement("div");
		
		nameDiv.innerHTML = this.openCoreObject.title;
		nameDiv.setAttribute("class", "nameDiv");
		
		this.targetDiv.appendChild(nameDiv);
		
		this.gridDiv = document.createElement("div");
		this.gridDiv.setAttribute("id", this.openCoreObject.name + ":grid");
		this.gridDiv.setAttribute("class", "formGrid");
		this.targetDiv.appendChild(this.gridDiv);
		
		
		this.fieldsDiv = document.createElement("div");
		this.fieldsDiv.setAttribute("id", this.openCoreObject.name + ":fields");
		this.fieldsDiv.setAttribute("id", "formFields");
		this.targetDiv.appendChild(this.fieldsDiv);
		
		
		this.childFormObjectsDiv = document.createElement("div");
		this.childFormObjectsDiv.setAttribute("id", this.openCoreObject.name + ":childFormObjects");
		this.childFormObjectsDiv.setAttribute("class", "childFormObjects");
		this.targetDiv.appendChild(this.childFormObjectsDiv);
	},
	
	createTopLevelForm : function(){
		console.log("FormObject:createTopLevelForm");
		// is object
		
		// first tab
		// do we need a rebuild?
		this.setCurrentInstance(this.controller.currentRootClassInstance);
		
		
		// is there an instance?
		if (this.currentInstance != undefined) {
			console.log("there is an instance");
			if(this.isBuilt == true){
				var record = this.controller.dataManager.getRecord(this.openCoreObject.name, this.currentInstance.id);
				this.currentInstance = record[this.openCoreObject.name];
				this.openCoreObject.instances[this.currentInstance.id] = this.currentInstance;
			}
		
			// UPDATE
			if (this.openCoreObject.canUpdate == true) {
				console.log("can update");
				// alright, now we can display these fields
				var targetDiv;
				if (this.openCoreObject.singleton == true && this.openCoreObject.canDelete == true) {
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
				this.createFields(this.openCoreObject, this.currentInstance, "", targetDiv);
				
			} else if (this.openCoreObject.canGetInfo == true) {
				console.log("can not update");
				// not updateable yet able to show some info
				if (this.openCoreObject.singleton == true && this.openCoreObject.canDelete == true) {
					console.log("is singleton and can delete");
					
					targetDiv = document.createElement("div");
					targetDiv.setAttribute("style", "border: 1px solid #F00");
					targetDiv.appendChild(document.createTextNode("delete this object?"));
					this.fieldsDiv.appendChild(targetDiv);
				} else {
					console.log("not singleton or can not delete");
					targetDiv = this.fieldsDiv;
				}
				
				this.createFields(this.openCoreObject, this.currentInstance, "", targetDiv);
			
			} else {
			// nothing goes from here, there's nothing here to see
			}
			
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
				this.createCreateOption(true);
			}
		}
		
	},
	
	createSubLevelForm : function(){
		console.log("FormObject:createSubLevelForm");
		console.log("not first tab  " + this.openCoreObject.name);
		
		
		this.openCoreObject.setHasFetchedInstances(false);
		this.instances = this.openCoreObject.getInstancesByParentUUID(this.parentUUID);
		
		if (this.instances != undefined && typeof(this.openCoreObject.getFirstInstance()) == "object") {
			// there are instances
			console.log("this.currentInstance2");
			
			
			var instance = this.getPreviousInstance();
			if (instance != undefined) {
				this.setCurrentInstance(instance);
			} else {
				this.setCurrentInstance(this.openCoreObject.getFirstInstance());
			}			
			// now we have to figure out if the current opencore object is a meta object
			var actualOpenCoreObject;
			var actualInstance;
			console.log("currentInstance " + this.currentInstance);
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
			console.log(actualInstance);
			if(actualOpenCoreObject.singleton == true){
				console.log("singleton");
				// show fields
				this.createFields(actualOpenCoreObject, actualInstance, "", this.fieldsDiv);
				this.createDeleteOption();
			} else {
				console.log("not singleton");
				// not a singleton
				// the grid should always be displayed with non meta values
				this.createGrid(this.openCoreObject, this.instances, "callBackCommand", this.gridDiv, {});
				// here's where we have to check for meta stuff
				this.createFields(actualOpenCoreObject, actualInstance, "", this.fieldsDiv);
				
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
				if(this.openCoreObject.meta == true){
					// list objects
					
					this.createMultiCreateOption();
				} else {
					if (this.openCoreObject.canCreate == true) {
						this.createCreateOption();
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
				
				
				
			}
		}
		else {
			// no instances, show create new instance
			console.log("no instances");
			var msg = "No instances of " + this.openCoreObject.title + ". ";
			var pElement = document.createElement("p");
			this.gridDiv.appendChild(document.createTextNode(msg));
			if(this.openCoreObject.meta == true){
				// list objects
				this.createMultiCreateOption(true);
			} else {
				if (this.openCoreObject.canCreate == true) {
					this.createCreateOption(true);
				}
			}
			
			
		}
		
		
		// create buttons
		
		
	},
	
	createMultiCreateOption : function(){
			
		var metaObjects = this.controller.dataManager.getOpenCoreObjectsByMetaName(this.openCoreObject.name);
		var available = {};
		var canAdd = false;
		console.log(metaObjects);
		var canAdds = {};
		
		for(var i = 0;i<metaObjects.length;i++){
			var metaObject = metaObjects[i];
			// get quota, compare, etc
			canAdds[metaObject.name] = this.controller.dataManager.checkQuotum(metaObject.name);
			if(this.controller.dataManager.checkQuotum(metaObject.name)){
				available[metaObject.name] = metaObject;
				canAdd = true;
			}
		}
		
		if(canAdd == true){
			var createOne = document.createElement("span");
			var hook = this;
			this.gridDiv.appendChild(createOne);
			var s = document.createElement("select");
			var optionElement = document.createElement("option");
				
				optionElement.appendChild(document.createTextNode("select..."));
				
				s.appendChild(optionElement);
				
			s.onchange = function(){
				console.log(this);
				for(var i = 0;i<this.options.length;i++){
					var option = this.options[i];
					if(option.value == this.value){
						var openCoreObject = option.openCoreObject;
					}
				}
				
				if(openCoreObject != undefined){
					hook.controller.action({
						command: "showCreateInstanceFromFormObjectMeta",
						formObject : hook,
						openCoreObject:openCoreObject,
						parentUUID: hook.parentUUID,
						formObjectHolder : hook.formBuilder.formObjectHolder
					});
				}
			}
			
			/*
			 * 
	
			 */
			for(var key in available){
				var metaObject = available[key];
				var optionElement = document.createElement("option");
				optionElement.value = key;
				optionElement.appendChild(document.createTextNode(key));
				optionElement.openCoreObject = metaObject;
				s.appendChild(optionElement);
			}
			
			// quota debug stuff
			createOne.appendChild(s);
			q = document.createElement("ul");
			createOne.appendChild(q);
			
			for(var key in canAdds){
				var quotum = this.controller.dataManager.getQuotumByClassName(key);
				if(quotum != undefined){
					var li = document.createElement("li");
					li.appendChild(document.createTextNode(">>quotum : " + key + " " + quotum.quota));
					q.appendChild(li);
				}
			}
		}
		
		
	},
	
	createCreateOption : function (textOnly){
		// does not support meta stuff
		if (this.openCoreObject.meta == true) {
		
		} else {
			if (this.controller.dataManager.checkQuotum(this.openCoreObject.name) == true) {
				var createOne = document.createElement("span");
				if (textOnly != undefined) {
					var createOneText = document.createTextNode("Click here to create one.");
					createOne.setAttribute("class", "createOneSpan");
					createOne.appendChild(createOneText);
				} else {
					var addButton = document.createElement("div");
					addButton.setAttribute("class", "addButton");
					createOne.appendChild(addButton);
				}
				var hook = this;
				createOne.openCoreObject = this.openCoreObject;
				
				createOne.onclick = function(){
					hook.controller.action({
						command : "showCreateInstanceFromFormObject", 
						formObject: hook,
						openCoreObject: hook.openCoreObject,
						parentUUID: hook.parentUUID,
						formObjectHolder: hook.formBuilder.formObjectHolder
					});
					
					console.log("create Instance of " + hook.openCoreObject.name + " with parentUUID " + hook.parentUUID);
					console.log(hook);
					console.log(hook.formBuilder.formObjectHolder);
					
				}
				
				// quota debug stuff
				q = document.createElement("ul");
				createOne.appendChild(q);
				/*
				var quotum = this.controller.dataManager.getQuotumByClassName(this.openCoreObject.name);
				if (quotum != undefined) {
					var li = document.createElement("li");
					li.appendChild(document.createTextNode(">>quotum : " + this.openCoreObject.name + " " + quotum.quota));
					q.appendChild(li);
				}
				*/
				this.gridDiv.appendChild(createOne);
			}
		}
	},
	
	
	
	createDeleteOption : function (){
		var deleteOne = document.createElement("span");
		var deleteButton = document.createElement("div");
		deleteButton.setAttribute("class", "deleteButton");
		deleteOne.appendChild(deleteButton);
		
		var hook = this;
		deleteOne.openCoreObject = this.openCoreObject;
		
		deleteOne.onclick = function(){
			hook.controller.action({
				command : "showDeleteInstanceFromFormObject",
				formObject : hook,
				openCoreObject:hook.openCoreObject,
				parentUUID: hook.parentUUID,
				formObjectHolder : hook.formBuilder.formObjectHolder
			});
			
			console.log("delete Instance of " + hook.openCoreObject.name + " with parentUUID " + hook.parentUUID);
			
			
		}
		this.gridDiv.appendChild(deleteOne);
	},
	
	getPreviousInstance : function(){
		var previousInstanceName = this.formBuilder.getInstance(this.openCoreObject.name);
		var previousInstance = this.instances[previousInstanceName];
		if(previousInstance!= undefined){
			return previousInstance;
		}
	},
	
	setCurrentInstance : function(instance){
		if (instance != undefined) {
			this.currentInstance = instance;
			this.openCoreObject.currentInstance = instance;
			this.formBuilder.setCurrentInstance(this.openCoreObject.name, instance.id);
		}
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
	
	createModalFields : function(openCoreObject, instance, callBackCommand, targetDiv, optionalCallBackObject){
		
		this.fields = new OpenPanel.GUIBuilder.GUIElements.FormFields();	
		this.fields.setTargetDiv(targetDiv);
		this.fields.setOpenCoreObject(openCoreObject);
		this.fields.setFormObject(this);
		this.fields.setInstance(instance);
		this.fields.setIsCreate(true);
		this.fields.setZIndex(10000);
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
		console.log("clickGridItem " + instance["class"] + this.openCoreObject.name);
		var actualInstance;
		this.setCurrentInstance(instance);
		
		// this has to go ^^
		
		if (this.openCoreObject.meta == true) {
			console.log(this.openCoreObject.name + " is meta");
			var record = this.controller.dataManager.getRecord(instance["class"], instance.id);
			console.log("FormObject:clickGridItem record");
			console.log(record);
			instance = record[instance["class"]];
			if (instance != undefined) {
				console.log("is not undefined");
				console.log(instance);
				this.currentMetaInstance = instance;
				
			} else {
				// errors here
			}
		}
		actualInstance = instance;
		console.log(instance);
		
		var openCoreObject = this.controller.dataManager.getOpenCoreObjectByName(actualInstance["class"]);
		console.log("clickGridItem2 " + openCoreObject.name);
		
		
		this.createFields(openCoreObject, actualInstance, "", this.fieldsDiv);
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
		childFormObject.setFormBuilder(this.formBuilder);
		childFormObject.build();
		
		this.childFormObjects[openCoreObject.name] = childFormObject;
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;
		console.log("setOpenCoreObject");
		console.log(openCoreObject);
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
	},
	
	updateInstance: function(openCoreObject, instance, formData){
		console.log(this.openCoreObject.name);
		console.log(formData);
	},
	
	updateRootInstance: function(openCoreObject, instance, formData){
		console.log(this.openCoreObject.name);
		console.log(this);
		this.controller.action( {
			command : "updateRootInstance",
			openCoreObject : openCoreObject,
			instance : instance,
			formData : formData
		});
	},
	
	createCreatePopUp : function(targetDiv, callBack){
		var popUpDiv = this.guiBuilder.createPopUp();
	}
	
  }
 
 
