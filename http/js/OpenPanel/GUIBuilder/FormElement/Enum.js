OpenPanel.GUIBuilder.FormElement.Enum = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.enumSet = new Object();
	this.hideAsterisk = true;
}

OpenPanel.GUIBuilder.FormElement.Enum.prototype = {
	setEnumSet : function(enumSet){
		this.enumSet = enumSet;
		this.selectElement;
	},
	
	renderInputElement: function(){
		var divElement = document.createElement("div");
		if(this.readOnly == false){
			this.selectElement = document.createElement("select");
			this.selectElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
			var hook = this;
			this.selectElement.onchange = function(){
				hook.setValue(this.value);
			}
			var i = 0;
			for(var enumName in this.enumSet){
				var enumSetElement = this.enumSet[enumName];
				var optionElement = document.createElement("option");
				optionElement.setAttribute("value", enumName);
				optionElement.appendChild(document.createTextNode(enumSetElement.description));
				enumSetElement.index = i;
				this.selectElement.appendChild(optionElement);
			}
		} else {
			this.selectElement = document.createElement("div");
			this.selectElement.className = "stringElementDisabled";
			this.disable();
		}
		divElement.appendChild(this.selectElement);
		
		var a = false;
		for(var key in this.enumSet){
			if(a == false){
				a = true;
				this.setValue(key);
			}
		}
		return divElement;
	},
	
	getValue : function(){
		if (this.selectElement != undefined)
		{
			this.value = this.selectElement.value;
		}
		return this.value;
	},
	
	resetValue : function(){
		for (var enumName in this.enumSet) {
			this.setValue(enumName);
			break;
		}
	},
	
	setValue : function(value) {
		
		if (this.readOnly == false) {
			if (this.selectElement != undefined) {
				this.selectElement.value = value;
			}
		} else {
			if (this.selectElement != undefined) {
				this.selectElement.innerHTML = value;
			}
		}
		this.hasValue = true;
		this.value = value;
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
	}
}
