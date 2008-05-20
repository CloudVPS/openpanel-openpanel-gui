OpenPanel.GUIBuilder.Widget.TextField = function(){  
	this.inputElement = {};
	this.regExp = null;
	this.size = 10;
	this.formerValue = "";
	this.onKeyUpHandlers = new Array();
	this.onKeyDownHandlers = new Array();
}

OpenPanel.GUIBuilder.Widget.TextField.prototype = {
 	
	init : function(initObject){
		this.$super.init(this, initObject);
		if(this.parameter.size != undefined){
			this.size = this.parameter.size;
		}
		
		if(this.parameter.regExp != undefined){
			this.setRegExp(this.parameter.regExp);
		}
		
		if(this.parameter.minValue != undefined){
			this.minValue = this.parameter.minValue;
		}
		
		if(this.parameter.maxValue != undefined){
			this.maxValue = this.parameter.maxValue;
		}
	},
	
	buildFields: function(){
		
		this.fieldElementContainer = document.createElement("div");
		this.fieldElementContainer.setAttribute("class", "fieldElementContainer");
		this.fieldElement = document.createElement("div");
		this.fieldElement.setAttribute("class", "fieldElement");
		this.fieldElementContainer.appendChild(this.fieldElement);
		
		this.createInputField();
		this.fieldElement.appendChild(this.inputElement);	
		
	},
	
	createInputField : function(){
		
		this.inputElement = document.createElement("INPUT");
		this.inputElement.owner = this;
		this.inputElement.setAttribute("type", "text");
		this.inputElement.setAttribute("size", this.size);
		
		var hook = this;
		this.inputElement.onkeydown = function(event){
			return hook.onkeydown(this, event);
		}
		
		this.inputElement.onkeyup = function(event){
			return hook.onkeyup(this, event);
		}
		
		return this.inputElement;
	},
	
	enable : function(){
		this.inputElement.disabled = false;
		this.inputElement.setAttribute("class", "textFieldEnabled");
	},
	
	disable : function(){
		this.inputElement.disabled = true;
		this.inputElement.setAttribute("class", "textFieldDisabled");
		console.log(this.inputElement);
	},
	
	onkeydown : function(inputElement, someEvent){
		this.setChanged();
		if (inputElement.value != undefined) {
			if (inputElement.value.length == 0 || this.matchRegExp(inputElement.value) == true) {
				this.formerValue = inputElement.value;
			} else {
				inputElement.value = this.formerValue;
			}
		}
	},
	
	onkeyup : function(inputElement, someEvent){
		if (inputElement.value != undefined) {
			var r = this.matchRegExp(inputElement.value);
			if (inputElement.value.length != 0) {
				if (r == false) {
					inputElement.value = this.formerValue;
				}
			}
		}
		
		for(var i = 0; i<this.onKeyUpHandlers.length;i++){
			this.onKeyUpHandlers[i](inputElement, someEvent);
		}
	},
	
	setValue: function(someValue){
		if (someValue != undefined) {
			var someValue = new String(someValue);
			if (someValue != "" && this.matchRegExp(someValue)) {
				this.inputElement.value = someValue;
				this.formerValue = someValue;
			}
		} else {
			this.inputElement.value = "";
		}
	},
	
	getValue: function(){
		return this.inputElement.value==""?undefined:this.inputElement.value;
	},
	
	setRegExp : function(expression){
		this.regExp = new RegExp(expression);
	},
	
	matchRegExp : function(someString){
		if (someString != undefined) {
			if (this.regExp == null) {
				return true;
			} else {
				var r = someString.match(this.regExp);
				return r != null ? true : false;
			}
		} else {
			return false;
		}
	},
	
	addOnKeyUpHandler : function(handler){
		this.onKeyUpHandlers.push(handler);
	},
	
	addOnKeyDownHandler : function(handler){
		this.onKeyDownHandlers.push(handler);
	}
}