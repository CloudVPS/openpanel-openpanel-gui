OpenPanel.GUIBuilder.FormElement.Password = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.textwidth = initObject.textwidth || 30;
	this.inputElement;
	this.hasValue = false;
	this.canHasFocus = true;
	this.regExp = initObject.regexp?new RegExp(initObject.regexp):null;
	this.example = initObject.example?initObject.example:null;
	this.virgin = true;
	if(this.isCreate == false){
		this.required = false;
	}
}

OpenPanel.GUIBuilder.FormElement.Password.prototype = {
	renderInputElement : function(){
		var divElement = document.createElement("div");
		
		if (this.readOnly == false) {
			this.inputElement = document.createElement("INPUT");
			this.inputElement.setAttribute("type", "password");
			this.inputElement.setAttribute("name", this.name);
			this.inputElement.setAttribute("id", this.name);
			this.inputElement.setAttribute("value", "");
			this.inputElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
			this.setStyle();
			var hook = this;
			this.inputElement.onchange = this.inputElement.onkeyup = this.inputElement.onkeydown = this.inputElement.onpaste = function() {
				hook.setValue(this.value);
				hook.virgin = false;
			}
			
			this.inputElement.onblur = function() {
				hook.onBlur();
			}
			
			this.inputElement.onfocus = function() {
				hook.onFocus();
			}
			
			this.setHint();
		} else {
			this.inputElement = document.createElement("div");
			this.disable();
			this.setStyle();
		}
		
		divElement.appendChild(this.inputElement);
		return divElement;
	},
	
	setStyle : function(){
		if (this.readOnly == false) {
			this.inputElement.className = "stringElement";
			this.setStyleWidth();
		} else {
			this.inputElement.className = "stringElementDisabled";
		}
	},
	
	setHintStyle : function(){
		if(this.isCreate == true){
			this.inputElement.className = "stringElementHint";
		} else {
			this.inputElement.className = "stringElementHintExistingPassword";
		}
		this.setStyleWidth();
	},
	
	setStyleWidth : function(){
		this.inputElement.style["width"] = (this.textwidth * 7.7) + "px";	
	},
	
	focus : function(){
		if (this.readOnly == false) {
			this.inputElement.focus();
		}
	},
	
	onBlur : function(){
		this.validate();
		this.setHint();
	},

	setHint : function(){
		if(this.hasValue == false){
			if (this.readOnly == false) {
				this.inputElement.value = this.example != undefined ? this.example : "";
				this.setHintStyle();
			}
		}
	},
	
	onFocus : function(){
		this.setStyle();
		if(this.hasValue == false){
			this.inputElement.value = "";
		}
	},
	
	resetValue : function(){
		this.value = null;
		this.hasValue = false;
		this.setHint();
		this.setValidity(true);
	},
	
	setValue : function(value, setInitialValue){
		if (value != undefined && value!="" && value.length>0) {
			this.value = value;
			if (this.readOnly == false) {
				this.hasValue = true;
				this.setStyle();
				if (this.inputElement != undefined && this.inputElement.value != value) {
					this.inputElement.value = value;
				}
				this.validate();
			} else {
				this.inputElement.innerHTML = value;
			}
		} else {
			this.value = null;
			this.hasValue = false;
			this.validate();
		}
		
		if(setInitialValue == true){
			this.initialValue = this.value;
		}
		
		this.onChange();
	},
	
	getValue : function(){
		return this.hasValue == true?this.value:"";
	},
	
	validate : function(){
		var isValid = true;
			
		if(this.regExp!=undefined && this.regExp !=""){
			if(this.value!="" && this.value != undefined){
				if(!this.value.match(this.regExp)){
					isValid = false;
				}
			}
		}
		
		if(this.required == true){
			if(this.value=="" || this.value == undefined){
				isValid = false;
			}
		}
		
		this.setValidity(isValid);
		return this.isValid;
	},
	
	setValidity : function(validity){
		this.isValid = validity;
		if (this.labelElement != undefined) {
			if (this.isValid == true || this.virgin == true) {
				this.inputElement.removeClassName("fieldElementError");
			} else {
				this.inputElement.addClassName("fieldElementError");
			}
		}
	},
	
	enable : function(){
		if (this.inputElement != undefined) {
			this.inputElement.removeAttribute("disabled");
		}
	},
	
	disable : function(){ 
		this.inputElement.setAttribute("disabled", true); 
	}
	
}