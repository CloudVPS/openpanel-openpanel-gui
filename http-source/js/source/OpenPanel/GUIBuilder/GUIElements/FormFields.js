OpenPanel.GUIBuilder.GUIElements.FormFields = function(){
	
	this.targetDiv = {};
	this.formObject = {};
	this.instance = undefined;
	this.fieldsDiv = {};
	this.openCoreObject = {};
	this.openCoreInstance = {};
	this.controller= {};
	this.fieldValues = {};
	this.callBackCommand = "";
	this.optionalCallBackObject = {};
	this.formPanel = {};
	this.ZIndex = 0;
	this.isCreate = false;
	this.formItems = {};
	this.items = [];
	this.itemCount = 0;
	this.onChangeHandler;
}

OpenPanel.GUIBuilder.GUIElements.FormFields.prototype = {
	
	setOnChangeHandler : function(onChangeHandler){
		this.onChangeHandler = onChangeHandler;
	},
	
	build : function(isCreate){
		this.isCreate = isCreate != undefined?isCreate:false;
		this.itemCount = 0;
		if(this.targetDiv!=undefined){
			this.targetDiv.innerHTML = "";
			
			this.fieldsDiv = document.createElement("div");
			this.fieldsDiv.setAttribute("class", "fields");
			this.targetDiv.appendChild(this.fieldsDiv);
			if (this.instance != undefined) {
				this.createFields(this.instance);
			}
		}
	},

	createFields : function(instance){	
		if(instance == undefined){
			instance = {};
		}
		
		if(this.openCoreObject != undefined && this.openCoreObject.classInfo != undefined && this.openCoreObject.classInfo.structure != undefined && this.openCoreObject.classInfo.structure.parameters != undefined){
			
			var fieldContainerGroup = window.OpenPanel.GUIBuilder.drawGroup();
			var groupHolder = fieldContainerGroup.groupHolder;
			var contentDiv = fieldContainerGroup.contentDiv;
			this.fieldsDiv.appendChild(groupHolder);
			var parameters = this.openCoreObject.classInfo.structure.parameters;
			
			var formParameters = {};
			for(var parameterName in parameters){
				if (!(this.openCoreObject.singleton == true && parameterName == "id")) {
					if (formParameters[parameterName] == undefined) {
						formParameters[parameterName] = {};
					}
					var parameter = parameters[parameterName];
					parameter.hide = false;
					if (this.isCreate == true) {
						parameter.readOnly = false;
					} else {
						if (parameter.enabled == false || this.openCoreObject.canUpdate == false || parameterName == "id") {
							parameter.readOnly = true;
							if (parameterName == "id") parameter.hide = true;
						} else {
							parameter.readOnly = false;
						}
					}
					
					for (var anotherKey in parameter) {
						formParameters[parameterName][anotherKey] = parameter[anotherKey];
					}
				}
			}
			
			/*if(this.isCreate == true && this.openCoreObject.singleton == true){
				formParameters["id"]["type"] = "hidden";	
			}
			*/
			var enumerations = this.openCoreObject.getEnums();
			
			if(this.openCoreObject.isRootObject){
				formParameters.owner = {
					type: "enum",
					description: "Owner"
				}
				var userOpenCoreObject = this.formObject.controller.dataManager.getOpenCoreObjectByName("User");
				userOpenCoreObject.setHasFetchedInstances(false);
				var instances = userOpenCoreObject.getInstances();
				enumerations["owner"] = {};
				if(instances != undefined){
					for(var userName in instances){
						enumerations.owner[userName] = {description: userName}
					}
				}
				if(this.isCreate == false){
					formParameters.owner.readOnly = true;
				}
			}
			var data = {
				structure: {
					parameters: formParameters
				},
				enums : enumerations,
				isCreate : this.isCreate
			}
			this.formPanel = new OpenPanel.GUIBuilder.Form("firstForm", data, this.onChangeHandler);
			this.formPanel.setOwningObject(this);
			this.formPanel.addRenderer(
				new OpenPanel.GUIBuilder.SingleColumnFormRenderer({
					name: "SingleColumnFormRenderer"
				})
			);
			contentDiv.appendChild(this.formPanel.render("SingleColumnFormRenderer"));
			
			var values = {};
			for(var key in instance){
				values[key] = instance[key];
			}
			
			if(this.openCoreObject.isRootObject){
				if (this.isCreate == true) {
					values.owner = this.formObject.controller.currentUser;
				} else {
					values.owner = "root";
					
					if(instance.ownerid!=undefined){
						var userOpenCoreObject = this.formObject.controller.dataManager.getOpenCoreObjectByName("User");
						var userInstance = userOpenCoreObject.getInstanceByUUID(instance.ownerid);
						
						if(userInstance != undefined){
							values.owner = userInstance.id;
						}
					}
				}
			}
			
			this.formPanel.setValues(values);
		} else {
			// no, is it a singleton?
			if(this.openCoreObject.singleton == true){
				// draw a delete button
			} else {
				// don't draw anything at all (this object can be deleted
				// errr wut?
			}
		}
	},
	
	createTextField : function(fieldName, obj){
		var item = {
			xtype:'textfield',
			fieldLabel: obj.description,
			name: fieldName
		};
		
		return item;
	},
	
	setZIndex : function(zIndex){
		this.ZIndex = zIndex;
	},
	
	getFormValues : function(){
		return this.formPanel.getValues();
	},
	
	setInstance : function(instance){
		this.instance = instance;	
	},
	
	getInstance: function(){
		return this.instance;
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setOpenCoreInstance: function(openCoreInstance){
		this.openCoreInstance = openCoreInstance;
	},
	
	setTargetDivName : function(targetDivName){
		var targetDiv = document.getElementById(targetDivName);
		this.setTargetDiv(targetDiv);
	},
	
	setTargetDiv: function(targetDiv){
		if(targetDiv != undefined){
			this.targetDiv = targetDiv;
		} else {
			alert("div does not exist "+ targetDivName);
		}
	},
	
	setFormObject: function(formObject){
		this.formObject = formObject;
	},
	
	setController : function(controller){
		this.controller = controller;
	},
	
	setCallBackCommand : function(callBackCommand, optionalCallBackObject){
		this.callBackCommand = callBackCommand;
		if(this.optionalCallBackObject != undefined){
			this.optionalCallBackObject = optionalCallBackObject;
		}
	},
	
	setIsCreate : function(bool){
		this.isCreate = bool;
	},
	
	submit : function(){
		if(this.formPanel.validate() == true){
			var values = this.formPanel.getValues();
			if(this.callBackCommand != undefined){
				var actionObject = {}
				actionObject.formValues = values;
				actionObject.openCoreObject = this.openCoreObject;
				actionObject.command = this.callBackCommand;
				actionObject.optionalCallBackObject = this.optionalCallBackObject;
				this.controller.action(actionObject);
			}
		}
	}
}