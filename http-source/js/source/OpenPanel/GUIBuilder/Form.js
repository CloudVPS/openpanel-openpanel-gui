
OpenPanel.GUIBuilder.Form = function(name, data, onChangeHandler){
	this.data = data;
	this.name = name;
	this.formElements = new Array();
	this.formElementMap = {};
	this.valueMap = {};
	this.formRenderers = {};
	this.groups = new Object();
	this.openCoreObject = {};
	this.hideAsterisks = false;
	this.isCreate = data.isCreate!=undefined?data.isCreate:false;
	this.onChangeHandler;
	this.forms.push(this);
	this.owningObject;
	try {
		if (data == undefined) {
			throw new Error("data missing");
		}
		if(onChangeHandler!=undefined){
			this.onChangeHandler = onChangeHandler;
		}
		
		var parameters = data.structure.parameters;
		for (var parameterName in parameters) {
			var parameter = parameters[parameterName];
			if (parameter.hide == true) continue;
			if (parameter.type == undefined) continue;
			if (parameter.type == null) continue;
			
			parameter.type = parameter.type.substr(0, 1).toUpperCase() + parameter.type.substr(1);
			parameter.isCreate = this.isCreate;
			parameter.onChangeHandler = this.onChangeHandler;
			if (OpenPanel.GUIBuilder.FormElement[parameter.type] != undefined) {
				var e = new OpenPanel.GUIBuilder.FormElement[parameter.type](parameterName, this, parameter);
				this.addElement(e);
			}
		}
	} catch (e) {
		throw e;
	}
}

OpenPanel.GUIBuilder.Form.prototype = {
	forms: new Array(),
	
	focusOnFirstField : function(){
		for(var i = 0;i<this.formElements.length;i++){
			var formElement = this.formElements[i];
			if(formElement.canHasFocus == true){
				formElement.focus();
				break;
			}
		}
	},
	
	onChange : function(formElement){
		if(this.onChangeHandler!=undefined){
			this.onChangeHandler();
		}
	},
	submit : function(){
		return this.validate();
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
							formElement.setInitialValue(this.valueMap[key]);
							this.enableGroupedFormElement(formElement);
						}
					}
				} else {
					this.formElementMap[key].setInitialValue(this.valueMap[key]);
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
			if(this.data.enums != undefined && this.data.enums[formElement.name]) {
				formElement.setEnumSet(this.data.enums[formElement.name]);	
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
			if(!validFormElement){
				isValid = false;
			}
		}
		return isValid;
	},
	
	getValues : function(){
		this.validate();
		var results = new Object();
		for(var key in this.formElementMap){
			var formElement = this.formElementMap[key];
			if (formElement.readOnly == false) {
				var value = formElement.getValue();
				if (value != undefined) {
					results[formElement.name] = value;
				}
			}
		}
		return results;
	},
	
	getElement : function(elementName){
		if(this.formElementMap[elementName]!=undefined){
			return this.formElementMap[elementName];
		}
	},
	
	enable : function(){
		// do we need this?
	},
	
	disable : function(){
		// do we need this?
	},
	
	setHideAsterisks : function(bool){
		this.hideAsterisks = bool == true ? true : false;
	},
	
	setOwningObject : function(owningObject){
		this.owningObject = owningObject;
	}
}

