OpenPanel.GUIBuilder.Widget.IPAddress = function(){  
	this.inputElement = {};
	this.ipFields = new Array();
}

OpenPanel.GUIBuilder.Widget.IPAddress.prototype = {
 	
	init : function(initObject){
		this.$super.init(this, initObject);
		console.log("I'm a IPAddress object");
	},
	
	buildFields: function(){
		this.fieldElementContainer = document.createElement("div");
		this.fieldElementContainer.setAttribute("class", "fieldElementContainer");
		this.fieldElement = document.createElement("div");
		this.fieldElement.setAttribute("class", "fieldElement");
		this.fieldElementContainer.appendChild(this.fieldElement);
		
		
		for(var i = 0;i<4;i++){
			var ipField = document.createElement("INPUT");
			var hook = this;
			
			ipField.onkeypress = function(event){
				return hook.onkeypress(this, event);
			}
			
			ipField.onkeyup = function(event){
				hook.onkeyup(this, event);
			}
			
			ipField.index = i;
			ipField.setAttribute("type", "text");
			ipField.setAttribute("size", 3);
			this.fieldElement.appendChild(ipField);
			this.ipFields.push(ipField);
		}
	},
	
	onkeypress : function(ipField, someEvent){
		console.log(someEvent);
		if(
			(someEvent.charCode >= 48 && someEvent.charCode <=57) // numerics
			|| (someEvent.keyCode == 37 	// left
			|| someEvent.keyCode == 39		// right
			|| someEvent.keyCode == 8		// backspace
			|| someEvent.keyCode == 9		// tab
			|| someEvent.charCode == 46		// tab
			)
		){
			if(someEvent.charCode == 46){
				if(ipField.value.length>0){
					if (ipField.value.length > 0) {
						this.focusNextField(ipField);
					}
				}
				return false;
			} else {
				ipField.onkeypressOk = true;
			}
			
		} else {
			ipField.onkeypressOk = false;
			return false;
		}
		
	},
	
	onkeyup : function(ipField, someEvent){
		if (ipField.onkeypressOk == true) {
			if(ipField.value.length>1){
				if(ipField.value.substring(0,1) == "0"){
					ipField.value = ipField.value.substring(1, ipField.value.length);
				}
			}
			
			if(ipField.value > 255){
				ipField.value = ipField.value.substring(0,ipField.value.length-1);
			}
			
			var newValue = "";
			for(var i = 0;i<ipField.value.length;i++){
				var currentChar = ipField.value.charCodeAt(i);
				if(currentChar>=48 && currentChar<=57){
					newValue+=String.fromCharCode(currentChar);
				}
			}
			if (ipField.value != newValue) {
				ipField.value = newValue.substring(0, 3);
			}
			ipField.isTabbing = false;
			this.validateFields();
		}
	},
	
	validateFields : function(){
		var valid = true;
		var emptyFieldCount = 0;
		console.log("----");
		for(var i = 0;i<4;i++){
			var ipField = this.ipFields[i];
			console.log('valid', ipField.value);
			if(ipField.value>=0 && ipField.value <= 255 && ipField.value!=undefined && ipField.value!=""){
				console.log("ok");
			} else {
				valid = false;
				emptyFieldCount++;
			}
		}
		
		if(this.needed == false){
			console.log("emptyFieldCount", emptyFieldCount);
			if(emptyFieldCount==4 || valid == true){
				this.setFieldValid();
			} else {
				if(valid == false){
					this.setFieldNotValid();
				}
			}
		} else {
			if(valid == false){
				this.setFieldNotValid();
			} else {
				this.setFieldValid();
			}
		}
		
	},
	
	focusNextField : function(ipField){
		
		var nextIpField = this.ipFields[ipField.index+1];
		if(nextIpField!=undefined){
			nextIpField.focus();
			nextIpField.select();
		}
	},
	
	setValue: function(someValue){
		if (someValue != undefined) {
			var ipParts = someValue.split(".");
			for (var i in this.ipFields) {
				var ipField = this.ipFields[i];
				ipField.value = ipParts[i] != undefined && ipParts[i] != "" ? ipParts[i] : 0;
			}
		}
	},
	
	getValue: function(){
		var result = "";
		
		for(var i in this.ipFields){
			var ipField = this.ipFields[i];
			if (typeof(ipField) == "object") {
				result = result + (ipField.value!=undefined&&ipField.value!=""?ipField.value:0) + ".";
			}
		}
		result = result.substring(0, result.length-1);
		return result;
	}
}