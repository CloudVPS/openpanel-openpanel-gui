OpenPanel.GUIBuilder.FormElement.Base = function(name, form, initObject){
	this.openCoreObject = {};
	this.name = name;
	this.form = form;
	this.hideAsterisk = false;
	this.description = initObject.description;
	this.type = initObject.type;
	this.enabled = initObject.enabled?initObject.enabled:true;
	this.group = (initObject.group != undefined && initObject.group != "")?initObject.group:null;
	this.isGrouped = this.group != undefined?true:false;
	this.isFirstInGroup = false;
	this.isActiveInGroup = false;
	this.defaultValue = initObject["default"]?initObject["default"]:"";
	this.value = this.initialValue = this.defaultValue;
	
	this.required = initObject.required?initObject.required:false;
	this.toolTip = initObject.tooltip?initObject.toolTip:null;
	this.visible = initObject.visible?initObject.visible:true;
	this.sameLine = initObject.sameLine || false;
	this.readOnly = initObject.readOnly != undefined? initObject.readOnly:false;
	this.isCreate = initObject.isCreate != undefined? initObject.isCreate:false;
	this.sameline = initObject.sameline || false;
	this.breakcolumn = initObject.breakcolumn || false;
	this.paddingtop = (initObject.paddingtop != undefined)?initObject.paddingtop:0;
	this.labelwidth = (initObject.labelwidth != undefined)?initObject.labelwidth:0;
	this.hidelabel = (initObject.hidelabel != undefined)?initObject.hidelabel:false;
	this.radioElement;
	this.parentElement;
	this.DOMElement;
	this.labelElement;
	this.fieldElement;
	this.clickDivElement;
	this.onFocusTarget;
	this.onFocusFunction;
	this.onChangeHandler = (initObject.onChangeHandler != undefined)?initObject.onChangeHandler:undefined;
}

OpenPanel.GUIBuilder.FormElement.Base.tabIndex = 0;
OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex = function(){
	return ++OpenPanel.GUIBuilder.FormElement.Base.tabIndex;
}

OpenPanel.GUIBuilder.FormElement.Base.inherit = function(target, name, form, initObject){
	var o = new OpenPanel.GUIBuilder.FormElement.Base(name, form, initObject);
	for(var key in o){
		if(target[key] == undefined){
			target[key] = o[key];
		}
	}
}

OpenPanel.GUIBuilder.FormElement.Base.prototype = {
	renderLabel : function(){
		if (this.labelElement != undefined) {
			this.labelElement.innerHTML = "";
		} else {
			this.labelElement = document.createElement("div");
			this.labelElement.className = "labelElement";
		}
		this.labelElement.style.cursor = "default";
		if (this.hidelabel)
		{
			var textNode = document.createTextNode ("");
			this.labelElement.appendChild (textNode);
			this.labelElement.style.paddingLeft = "0px";
			this.labelElement.style.width = "4px";
			return this.labelElement;
		}
		
		var labelString = this.description;
		
		if(this.form.hideAsterisks == false && this.hideAsterisk == false){
			if(this.readOnly == false && this.form.isCreate == true){
				labelString += this.required == true?" *":"";
			}
		}
		labelString += ":";
		var textNode = document.createTextNode (labelString);
		this.labelElement.appendChild (textNode);
		this.labelElement.onclick = function() { return true; }
		this.labelElement.onmousedown = function() { return true; }
		return this.labelElement;
	},
	
	renderField : function(){
		if (this.fieldElement != undefined) {
			this.fieldElement.innerHTML = "";
		} else {
			if (this.isGrouped == true) {
				/*
				 * fieldElement
				 * 	|_ containerElement
				 * 		|_ labelelement
				 * 		|_ radioDivElement
				 * 		|_ this.fieldDivElement
				 *  |_ overlay div test
				 */
				var hook = this;
				
				this.fieldElement = document.createElement("div");
				this.fieldElement.style.cssText = "position: relative;";
				var containerElement = document.createElement("div");
				
				var labelElement = document.createElement("div");
				this.fieldElement.appendChild(containerElement);

				labelElement.className = "labelElement";
				labelElement.innerHTML = this.description;
				containerElement.appendChild(labelElement);
				this.clickDivElement = document.createElement("a");
				this.clickDivElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
				this.clickDivElement.innerHTML = "&nbsp;";
				this.showRadioClickDivElement();
				
				this.fieldElement.appendChild(this.clickDivElement);
				
				var radioDivElement = document.createElement("div");
				radioDivElement.className = "radioElement";
				
				this.fieldDivElement = document.createElement("div");
				this.fieldDivElement.innerHTML = "&nbsp;";
				radioDivElement.appendChild(this.fieldDivElement);
				containerElement.appendChild(radioDivElement);
				
				var inputElement = this.renderInputElement();
				inputElement.className = "fieldElement";
				
				containerElement.appendChild(inputElement);
				this.clickDivElement.formElement = hook;
				
				this.clickDivElement.onkeydown = function(){
					hook.form.enableGroupedFormElement(this.formElement);
				}
				
				this.clickDivElement.onmousedown = function(){
					this.isDown = true;
					if (hook.isActiveInGroup == true) {
						hook.fieldDivElement.className = "radioElementActiveDown";
					} else {
						hook.fieldDivElement.className = "radioElementInActiveDown";
					}
				}
				
				this.clickDivElement.onmouseout = function(){
					if(this.isDown == true){
						if(hook.isActiveInGroup == true){
							hook.fieldDivElement.className = "radioElementUp";						
						} else {
							hook.fieldDivElement.className = "radioElement";
						}
					}
				}
				
				this.clickDivElement.onmouseup = function(){
					this.isDown = false;
					hook.fieldDivElement.className = "radioElementUp";		
					hook.form.enableGroupedFormElement(this.formElement);
					hook.focus();
					if(hook.form.groups[hook.group] != undefined){
						for(var i=0;i<hook.form.groups[hook.group].length;i++){
							var someElement = hook.form.groups[hook.group][i];
							if(someElement.name != hook.name){
								someElement.showRadioClickDivElement();
							} else {
								someElement.hideRadioClickDivElement();
							}
						}
					}
				}
			} else {
				this.fieldElement = this.renderInputElement();
			}
			
			this.fieldElement.className = "fieldElement";
		}
		
		if(this.isGrouped == true) {
			this.disable();
		}
		
		return this.fieldElement;
	},
	
	showRadioClickDivElement : function(){
		this.clickDivElement.className = "clickDivActive";
	},
	
	hideRadioClickDivElement : function(){
		this.clickDivElement.className = "clickDivInActive";
	},
	
	renderInputElement : function(){
		return document.createElement("div");	
	},
	
	setValue : function(value, setInitial){ this.value = value; if(setInitial == true){ this.initialValue = value;}},
	
	setInitialValue : function(value){ this.setValue(value, true);},
	
	getValue : function(){ return this.value; },
	
	validate : function(){},
	
	setparentElement : function(parentElement){
		this.parentElement = parentElement;
	},
	
	resetValue: function(){
		this.setValue(this.resetValue);
	},
	
	setForm : function(form){
		this.form = form;
	},
	
	enable : function(){},
	
	disable : function(){},
	
	setOnFocusHandler : function(form, functionName){
		this.onFocusTarget = form;
		this.onFocusFunction = functionName;
	},
	
	onFocusHandler: function(){
		this.onFocusTarget[this.onFocusFunction](this);
	},
	
	onChange : function(){
		if(this.onChangeHandler != undefined){
			this.onChangeHandler(this);
		}
	},
	
	focus : function(){ }, 
	
	setValidity : function(validity){
		this.isValid = validity;
		if (this.labelElement != undefined) {
			if (this.isValid == true) {
				this.labelElement.className = "labelElement";
			} else {
				this.labelElement.className = "labelElementError";
			}
		}
	}
}
