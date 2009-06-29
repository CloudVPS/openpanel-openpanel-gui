OpenPanel.GUIBuilder.FormElement.Bool = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.hideAsterisk = true;
}

OpenPanel.GUIBuilder.FormElement.Bool.prototype = {
	renderLabel: function() {
		if (this.labelElement != undefined) {
			this.labelElement.innerHTML = "";
		} else {
			this.labelElement = document.createElement("div");
			this.labelElement.className = "labelElement";
		}
		var textNode = document.createTextNode ("");
		this.labelElement.appendChild (textNode);
		this.labelElement.style.paddingLeft = "0px";
		this.labelElement.style.width = "4px";
		return this.labelElement;
	},
		
	renderInputElement: function(){
		var divElement = document.createElement("div");
		this.checkboxElement = document.createElement("input");
		this.checkboxElement.setAttribute("type", "checkbox");
		this.checkboxElement.style.float = "left";
		this.checkboxElement.className = "checkboxElement";
		this.checkboxElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
		if ((this.value != undefined) && ((this.value == true)||(this.value == "true"))) {
			this.checkboxElement.setAttribute("checked", "true");
		}
		divElement.appendChild(this.checkboxElement);
		if(this.readOnly == false){
			var hook = this;
			this.checkboxElement.onchange = function(){
				hook.setValue(this.checked);
			}
			this.checkboxElement.removeAttribute("disabled");
		} else {
			this.checkboxElement.setAttribute("disabled", "true");
		}
		
		if (! this.hidelabel) {
			var suffixLabelElement = document.createElement ("div");
			suffixLabelElement.className = "labelElement";
			suffixLabelElement.style.float = "left";
			var suffixText = document.createTextNode (this.description);
			suffixLabelElement.appendChild (suffixText);
			divElement.appendChild (suffixLabelElement);
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
