OpenPanel.GUIBuilder.FormElement.IPAddress = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.ipElements = new Array();
	this.values = new Array();
}

OpenPanel.GUIBuilder.FormElement.IPAddress.prototype = {
	renderInputElement : function(){
		var divElement = document.createElement("div");
		var hook = this;
		for(var i=0;i<4;i++){
			var ipElement = document.createElement("div");
			var ipTextFieldElement = document.createElement("input");
			this.ipElements.push(ipTextFieldElement);
			ipTextFieldElement.regExp = new RegExp("^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$");
			ipTextFieldElement.isValid = false;
			ipTextFieldElement.index = i;
			ipTextFieldElement.onkeydown = function(){
				this.oldValue = this.value;
			}
			
			ipTextFieldElement.onkeyup = function(){
				if(this.oldValue != this.value){
					if(!this.value.match(this.regExp) && this.value!=""){
						this.value = this.oldValue!=undefined?this.oldValue:"";
						this.isValid = false;
					} else {
						hook.values[this.index] = this.value;
						this.isValid = true;
					}
					hook.setValidity(hook.validate());
				}
			}
			
			divElement.appendChild(ipTextFieldElement);
		}
		
		return divElement;
	},
	
	resetValue : function(){
		for (var i = 0; i < 4; i++) {
			var ipElement = this.ipElements[i];
			ipElement.value = "";
		}
	},
	
	validate : function(){
		this.isValid = true;
		for(var i=0;i<this.ipElements.length;i++){
			if(this.ipElements[i].isValid == false){
				this.isValid = false;
				break;
			}		
		}
		return this.isValid;
	},
	
	disable : function(){
		for(var i=0;i<this.ipElements.length;i++){
			this.ipElements[i].setAttribute("disabled", true);
		}
	},
	
	enable : function(){
		for(var i=0;i<this.ipElements.length;i++){
			this.ipElements[i].removeAttribute("disabled");
		}
	},
	
	setValue : function(value){
		this.values = value.split(".");
		for (var i = 0; i < this.ipElements.length; i++) {
			this.ipElements[i].value = this.values[i];
			this.ipElements[i].onkeyup();
		}
	},
	
	getValue : function(){
		return this.values.join(".");
	}
	
	
}