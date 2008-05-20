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
			var f = OpenPanel.GUIBuilder.Widget.createWidget(
				{
					label: "ip" + i, 
					type: "TextField", 
					size: "3", 
					regExp: "^([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$"
				}
			);
			f.init();
			var ipField = f.createInputField();
			
			var hook = this;
			
			ipField.onkeypress = function(event){
				return hook.onkeypress(this, event);
			}
			
			f.addOnKeyUpHandler(function(inputElement, someEvent){
				hook.onkeyup(inputElement, someEvent);
				hook.setChanged();
			});
			
			f.addOnKeyDownHandler(function(inputElement, someEvent){
				hook.onkeydown(inputElement, someEvent);
			});
			
			ipField.index = i;
			
			this.fieldElement.appendChild(ipField);
			
			if(i<3){
				var dotElement = document.createElement("SPAN");
				dotElement.appendChild(document.createTextNode("."));
				this.fieldElement.appendChild(dotElement);
			}
			this.ipFields.push(ipField);
		}
	},
	
	onkeypress : function(ipField, someEvent){
		if(someEvent.charCode == 46){
			if(ipField.value.length>0){
				if (ipField.value.length > 0) {
					this.focusNextField(ipField);
				}
			}
			return false;
		}
	},
	
	onkeyup : function(ipField, someEvent){
		this.validateFields();
	},
	
	validateFields : function(){
		var valid = true;
		var emptyFieldCount = 0;
		for(var i = 0;i<4;i++){
			var ipField = this.ipFields[i];
			if(ipField.value.length < 1 || ipField.value == undefined || ipField.value == ""){
				valid = false;
				emptyFieldCount++;
			}
		}
		
		if(this.needed == false){
			if(emptyFieldCount==4 || valid == true){
				this.setFieldValid();
			} else {
				if(valid == false){
					this.setFieldNotValid();
					this.isValid = false;
				}
			}
		} else {
			if(valid == false){
				this.setFieldNotValid();
				this.isValid = false;
			} else {
				this.setFieldValid();
				this.isValid = true;
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
		} else {
			for (var i in this.ipFields) {
				var ipField = this.ipFields[i];
				ipField.value = "";
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
	},
	
	enable : function(){
		for(var i = 0;i<this.ipFields.length;i++){
			var ipField = this.ipFields[i];
			ipField.owner.enable();
		}
	},
	
	disable : function(){
		if(this.isValid == false) {
			this.setValue();
			this.setFieldValid();
		}
		
		for(var i = 0;i<this.ipFields.length;i++){
			var ipField = this.ipFields[i];
			console.log('ehy now');
			ipField.owner.disable();
		}
	},
}