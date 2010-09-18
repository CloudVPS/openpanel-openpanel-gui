OpenPanel.GUIBuilder.FormElement.Integer = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.textwidth = initObject.textwidth || 30;
	this.inputElement;
	this.hasValue = false;
	this.regExp = /^-?[0-9]*$/;
	if (form.isCreate) this.example = initObject.example?initObject.example:null;
}

OpenPanel.GUIBuilder.FormElement.Integer.prototype = {
	renderInputElement : function(){
		var divElement = document.createElement("div");
		if (this.readOnly == false) {
			this.inputElement = document.createElement("INPUT");
			this.inputElement.setAttribute("type", "text");
			this.inputElement.setAttribute("name", this.name);
			this.inputElement.setAttribute("id", this.name);
			this.inputElement.setAttribute("value", "");
			this.inputElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
			this.setStyle();
			this.value = "";
			var hook = this;
			this.inputElement.onkeyup = this.inputElement.onkeydown = function() {
				hook.setValue(this.value);
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
		this.inputElement.className = "stringElementHint";
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
			if ((this.readOnly == false) && (this.form.isCreate == true)) {
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
		this.value = "";
		this.hasValue = false;
		this.setHint();
		this.setValidity(true);
	},
	
	setValue : function(value, setInitialValue){
		if (value != undefined && value!=="") {
			this.value = value;
			if (this.readOnly == false) {
				this.hasValue = true;
				this.setStyle();
				var valueString = "" + value;
				if (this.inputElement.value != valueString) {
					this.inputElement.value = valueString;
				}
				this.validate();
			} else {
				this.inputElement.innerHTML = value;
			}
		} else {
			this.value = "";
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
		if (this.readOnly == false) {
			var integerString = this.value + "";
			if (integerString != "") {
				if (isNaN(parseInt(integerString,10))) {
					isValid = false;
				}
			}
			
			if (this.required == true) {
				if (this.value == "" || this.value == undefined) {
					isValid = false;
				}
			}
		}
		
		this.setValidity(isValid);
		return this.isValid;
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
