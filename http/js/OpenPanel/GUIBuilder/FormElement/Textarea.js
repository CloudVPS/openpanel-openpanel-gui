OpenPanel.GUIBuilder.FormElement.Textarea = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.textwidth = initObject.textwidth || 30;
	this.rows = initObject.rows || 3;
	this.inputElement;
	this.hasValue = false;
	this.regExp = initObject.regexp?new RegExp(initObject.regexp):null;
	this.example = initObject.example?initObject.example:null;
}

OpenPanel.GUIBuilder.FormElement.Textarea.prototype = {
	renderInputElement : function(){
		var divElement = document.createElement("div");
		
		if (this.readOnly == false) {
			this.inputElement = document.createElement("textarea");
			
			this.inputElement.setAttribute("name", this.name);
			this.inputElement.setAttribute("id", this.name);
			this.inputElement.setAttribute("rows", this.rows);
			this.inputElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
			this.setStyle();
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
			this.inputElement = document.createElement("textarea");
			this.inputElement.setAttribute("rows", this.rows);
			this.disable();
			this.setStyle();
		}
		
		divElement.appendChild(this.inputElement);
		return divElement;
	},
	
	setStyle : function(){
		if (this.readOnly == false) {
			this.inputElement.className = "textareaElement";
		} else {
			this.inputElement.className = "textareaElementDisabled";
		}
		this.setStyleWidth();
	},
	
	setHintStyle : function(){
		this.inputElement.className = "textareaElementHint";
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
				this.inputElement.value = value;
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
	
	enable : function(){
		if (this.inputElement != undefined) {
			this.inputElement.removeAttribute("disabled");
		}
	},
	
	disable : function(){ 
		this.inputElement.setAttribute("disabled", true); 
	}
	
}
