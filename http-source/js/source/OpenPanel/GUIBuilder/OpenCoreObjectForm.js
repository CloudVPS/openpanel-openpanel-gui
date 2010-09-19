OpenPanel.GUIBuilder.OpenCoreObjectForm = function(name, className, isCreate){
		this.className = className;
		this.name = name;
		this.formElements = new Array();
		this.formElementMap = {};
		this.valueMap = {};
		this.formRenderers = {};
		this.forms.push(this);
		this.groups = new Object();
		this.openCoreObject = {};
		this.isCreate = isCreate;
		this.callbackCommand;
		
		try {
			if (className == undefined) {
				throw new Error("className missing");
			}
			
			this.openCoreObject = OpenCore.DataManager.getOpenCoreObjectByName(this.className);
			//console.log("Form", this.isCreate);
			if (this.openCoreObject == undefined) {
				throw new Error("OpenCoreObject '" + this.className + "' does not exist");
			}
			var parameters = this.openCoreObject.classInfo.structure.parameters;
			
			for (var parameterName in parameters) {
				var parameter = parameters[parameterName];
				if(this.isCreate == true){
					parameter.readOnly = false;
				} else {
					if(parameter.enabled == false || this.openCoreObject.canUpdate == false || parameterName == "id"){
						parameter.readOnly = true;
					} else {
						parameter.readOnly = false;
					}
				}
				
				parameter.type = parameter.type.substr(0, 1).toUpperCase() + parameter.type.substr(1);
				if (OpenPanel.GUIBuilder.FormElement[parameter.type] != undefined) {
					var e = new OpenPanel.GUIBuilder.FormElement[parameter.type](parameterName, this, parameter);
					if(e.name == "id" && this.openCoreObject.getClassInfo()["class"].indexing == "manual"){
						e.required = true;
					}
					this.addElement(e);
				}
			}
		} catch (e) {
			throw e;
		}
	}
		
	OpenPanel.GUIBuilder.OpenCoreObjectForm.prototype = {
		forms : new Array(),
		submit : function(){
			console.log("validate" + this.validate());
			console.log("callbackcommand", this.callbackCommand);
			// validate
			// getvalues
			// call callback command
		},
		setValues : function(valueMap){
			this.valueMap = valueMap;
			this.applyValues();
		},
		
		applyValues : function(){
			for(var key in this.valueMap){
				if(this.formElementMap[key] != undefined){
					var formElement = this.formElementMap[key];
					if(formElement.isGrouped == true){
						var group = this.groups[formElement.group];
						for(var i=0;i<group.length;i++){
							var groupFormElement = group[i];
							if(groupFormElement === formElement){
								formElement.setValue(this.valueMap[key]);
								this.enableGroupedFormElement(formElement);
							}
						}
					} else {
						this.formElementMap[key].setValue(this.valueMap[key]);
					}
				}
			}	
		},
		
		addElement : function(formElement){
			formElement.setForm(this);
			
			this.formElements.push(formElement);
			this.formElementMap[formElement.name] = formElement;
			if(formElement.isGrouped == true){
				this.addGroupFormElement(formElement);
				formElement.setOnFocusHandler(this, "enableGroupedFormElement");
			}
			if(formElement.type == "Enum"){
				if(this.openCoreObject.getClassInfo().enums != undefined && this.openCoreObject.getClassInfo().enums[formElement.name] != undefined){
					var enumSet = this.openCoreObject.getClassInfo().enums[formElement.name];
					formElement.setEnumSet(enumSet);	
				}
			}
		},
		
		removeElement : function(formElement){
			this.formElementMap[formElement.name] = undefined;
			for(var i = 0 ; i < this.formElements.length ; i++) {
				if(this.formElements[i] == formElement){
					this.formElements.splice(i,1);
					break;
				}
			}
		},
		
		resetElements : function(){
			for (var i = 0; i < this.formElements.length; i++) {
				this.formElements[i].reset();
			}
		},
		
		removeElements : function(){
			this.formElements = new Array();
			this.formElementMap = new Object();
		},
		
		setParentDOMElement : function(parentDOMElement){},
		
		addGroupFormElement : function(formElement){
			if (formElement.group != undefined) {
				if (this.groups[formElement.group] == undefined) {
					this.groups[formElement.group] = new Array();
					formElement.isFirstInGroup = true;
				}
				this.groups[formElement.group].push(formElement);
			}
		},
		
		enableGroupedFormElement : function(formElement){
			if (formElement != undefined && formElement.group!= undefined && this.groups[formElement.group] != undefined) {
				for (var i = 0; i < this.groups[formElement.group].length; i++) {
					var groupFormElement = this.groups[formElement.group][i];
					if (groupFormElement === formElement) {
						groupFormElement.enableRadio();
					} else {
						groupFormElement.resetValue();
						groupFormElement.disableRadio();
					}
				}
			}
		},
		
		addRenderer : function(formRenderer){
			if(this.defaultRendererName == undefined){
				this.defaultRendererName = formRenderer.name;
			}
			this.formRenderers[formRenderer.name] = formRenderer;
			formRenderer.setForm(this);
		},
		
		render : function(formRendererName){
			var currentFormRendererName = (formRendererName == undefined && this.defaultRendererName != undefined)?this.defaultRendererName:formRendererName;
			
			var r = this.formRenderers[currentFormRendererName].render();
			
			return r;
		},
		
		validate : function(){
			var isValid = true;
			for(var key in this.formElementMap){
				var formElement = this.formElementMap[key];
				var validFormElement = formElement.validate();
				console.log("validation; " + formElement.name + " " + validFormElement, formElement);
				if(!validFormElement){
					isValid = false;
				}
			}
		},
		
		getValues : function(){
			this.validate();
			var results = new Object();
			for(var key in this.formElementMap){
				var formElement = this.formElementMap[key];
				results[formElement.name] = formElement.getValue();
			}
			
			return results;
		},
		
		enable : function(){
			// do we need this?
		},
		
		disable : function(){
			// do we need this?
		},
		
		setCallbackCommand : function(callbackCommand){
			this.callbackCommand;
		}
	}

