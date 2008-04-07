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
	this.methodsDiv;
	this.buttonsDiv;
	this.childFormObjectsDiv;
	this.isUpdateable = false;
	this.childFormObjects = [];
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
				this.createSubLevelFormAsync();
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
		this.fieldsDiv.setAttribute("class", "formFields");
		this.targetDiv.appendChild(this.fieldsDiv);
		
		
		
		var anchorDiv = document.createElement("a");
		anchorDiv.setAttribute("name", this.openCoreObject.name);
		this.targetDiv.appendChild(anchorDiv);
		
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
				console.log('record', record);
				this.currentInstance = record[this.openCoreObject.name];
				
				this.openCoreObject.instances[this.currentInstance.id] = this.currentInstance;
				this.controller.currentRootClassInstance = this.currentInstance;
				console.log("asdasd",record,this.currentInstance, this.openCoreObject.instances);
			}
			
			// UPDATE
			if (this.openCoreObject.canUpdate == true) {
					
				this.setIsUpdateable(true);
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
				
				
			} else { //if (this.openCoreObject.canGetInfo == true) {
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
				this.createCreateOption(true);
			}
		}
		
		this.formBuilder.setIsUpdateable(false);
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
				
				if (actualOpenCoreObject.canUpdate == true) {
					this.setIsUpdateable(true);
				}
				console.log("actualOpenCoreObject", actualOpenCoreObject.name);
				this.createFields(actualOpenCoreObject, actualInstance, "", this.fieldsDiv);
				this.createMethods(actualOpenCoreObject);
					
					
				if(actualOpenCoreObject.singleton == true){
					console.log("singleton");
					// show fields
					
					this.createCreateOption(false, true);
					this.createDeleteOption();
				} else {
					console.log("not singleton");
					// not a singleton
					// the grid should always be displayed with non meta values
					console.log("create Grid for " + this.openCoreObject.name);
					console.log(this.instances);
					this.createGrid(this.openCoreObject, this.instances, "callBackCommand", this.gridDiv, {}, this.currentInstance);
					// here's where we have to check for meta stuff
					
					
					this.childFormObjects = [];
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
			} else {
				// no instances, show create new instance
				console.log("no instances");
				var msg = "No configured " + this.openCoreObject.title + " objects found. ";
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
			
			this.formBuilder.setIsUpdateable(false);
			this.formBuilder.finishLayout(this);
				break;
		}
		
	},
	
	setIsUpdateable : function(isUpdateable){
		this.isUpdateable = isUpdateable;
		console.log("setIsUpdateable", this.isUpdateable, this.openCoreObject.name);
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
						command: "ShowCreateInstanceFromFormObjectMeta",
						formObject : hook,
						openCoreObject:openCoreObject,
						parentUUID: hook.parentUUID,
						formObjectHolder : hook.formBuilder.formObjectHolder
					});
				}
			}
			
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
			var q = document.createElement("ul");
			//createOne.appendChild(q);
			
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
	
	createCreateOption : function (textOnly, displayOnly){
		// does not support meta stuff
		if (this.openCoreObject.meta == true) {
		
		} else {
			if (this.controller.dataManager.checkQuotum(this.openCoreObject.name) == true) {
				
				var createOne = document.createElement("span");
				if (textOnly == true) {
					createOne.innerHTML = "<b>Click here to create one.</b>";
					createOne.setAttribute("class", "createOneSpan");
					//createOne.appendChild(createOneText);
					
					
				} else {
					var addButton = document.createElement("div");
					var addButtonClass = displayOnly==true?"addButtonDisabled":"addButton";
					addButton.setAttribute("class", addButtonClass);
					
					createOne.appendChild(addButton);
				}
				var hook = this;
				createOne.openCoreObject = this.openCoreObject;
				if (displayOnly == undefined || displayOnly == false) {
					createOne.onclick = function(){
						hook.controller.action({
							command: "ShowCreateInstanceFromFormObject",
							formObject: hook,
							openCoreObject: hook.openCoreObject,
							parentUUID: hook.parentUUID,
							formObjectHolder: hook.formBuilder.formObjectHolder
						});
						
						console.log("create Instance of " + hook.openCoreObject.name + " with parentUUID " + hook.parentUUID);
						console.log(hook);
						console.log(hook.formBuilder.formObjectHolder);
						
					}
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
				
				if(textOnly == true){
					if(this.openCoreObject.classInfo["class"].explanation != undefined){
						var explanationElement = document.createElement("div");
						createOne.appendChild(explanationElement);
						explanationElement.innerHTML = "<br>"+this.openCoreObject.classInfo["class"].explanation;
						this.gridDiv.appendChild(explanationElement);
					}	
				}
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
				command : "ShowDeleteInstanceFromFormObject",
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
			if (typeof(childFormObject) == "object") {
				console.log("childFormObject", childFormObject);
				console.log("child: " + childFormObject.openCoreObject.name);
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
			this.targetDiv.appendChild(this.methodsDiv);
			var fieldContainerGroup = window.OpenPanel.GUIBuilder.drawGroup();
			
			var groupHolder = fieldContainerGroup.groupHolder;
			var contentDiv = fieldContainerGroup.contentDiv;
			this.methodsDiv.appendChild(groupHolder);
			
			var methods = openCoreObject.classInfo.structure.methods;
			var items = [];
			var hook = this;
			for(var key in methods){
				var method = methods[key];
				if(typeof(method) == "object"){
					var item = {
						html : method.description+method.description,
						style : "width: 100%;"
						
					};
					
					var button  = {
						xtype : "button",
						text : "Ok",
						style : "width: 100%;",
						foo : 100,
						handler: function(){
								hook.controller.action( 
						{ 
							command : "InvokeMethod",
							openCoreObject : openCoreObject,
							methodName : key
						});


						}
					}
					
					items.push(item);
					items.push(button);
				}
			}
			
			var table = new Ext.Panel({
			    layout:'table',
				style : "width: 600px;",
			    defaults: {
			        // applied to each contained panel
			        bodyStyle:'padding-right:20px; margin-top: 10px;margin-bottom: 10px'
			    },
			    layoutConfig: {
			        // The total column count must be specified here
			        columns: 2
			    },
				
				items :  items
			});
			table.render(contentDiv);
		}
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
		console.log("FormObject.clickGridItem", instance);
		this.controller.action({
			command : "ClickGridItem",
			formObject : this,
			instance : instance	
		})
	},
	
	createChildFormObject : function(openCoreObject, parentUUID, targetDiv, controller){
		var childFormObject = new OpenPanel.GUIBuilder.GUIElements.FormObject();
		this.childFormObjects.push(childFormObject);
		childFormObject.setOpenCoreObject(openCoreObject);
		childFormObject.setParentFormObject(this);
		
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
		this.formBuilder.setLastCreatedFormObject(this);
	},
	
	updateInstance: function(openCoreObject, instance, formData){
		console.log(this.openCoreObject.name);
		console.log(formData);
	},
	
	
	createCreatePopUp : function(targetDiv, callBack){
		var popUpDiv = this.guiBuilder.createPopUp();
	},
	
	setParentFormObject : function(formObject){
		this.parentFormObject = formObject;
		
	}
	
  }
 
 
