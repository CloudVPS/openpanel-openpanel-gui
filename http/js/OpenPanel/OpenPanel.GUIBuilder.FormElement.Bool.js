OpenPanel.GUIBuilder.FormElement.Bool = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.hideAsterisk = true;
}

OpenPanel.GUIBuilder.FormElement.Bool.prototype = {
	renderInputElement: function(){
		var divElement = document.createElement("div");
		this.checkboxElement = document.createElement("input");
		this.checkboxElement.setAttribute("type", "checkbox");
		this.checkboxElement.className = "checkboxElement";
		this.checkboxElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
		divElement.appendChild(this.checkboxElement);
		if ((this.value != undefined) && (this.value == true)) {
			this.checkboxElement.setAttribute("checked", "true");
		}
		if(this.readOnly == false){
			var hook = this;
			this.checkboxElement.onchange = function(){
				hook.setValue(this.checked);
			}
			this.checkboxElement.removeAttribute("disabled");
		} else {
			this.checkboxElement.setAttribute("disabled", "true");
		}
		return divElement;
	},
	
	resetValue : function(){
		for (var enumName in this.enumSet) {
			var enumSetElement = this.enumSet[enumName];
			this.setValue(enumSetElement.val);
			break;
		}
	},
	
	setValue : function(value) {
		if(value == true || value == "true"){
			this.checkboxElement.setAttribute("checked", "true");
			this.value = true;
		} else {
			this.checkboxElement.removeAttribute("checked");
			this.value = false;
		}
	},
	
	getValue : function() {
		if (this.value != undefined) return this.value;
		return false;
	},
	
	enable : function(){
		this.selectElement.removeAttribute("disabled");
	},
	
	disable : function(){ 
		this.selectElement.setAttribute("disabled", true); 
	},
	
	validate : function(){
		var isValid = true;
		this.setValidity(isValid);
		return this.isValid;
	},
}
