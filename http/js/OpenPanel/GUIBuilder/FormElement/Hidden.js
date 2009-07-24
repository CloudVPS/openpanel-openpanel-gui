OpenPanel.GUIBuilder.FormElement.String = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.textwidth = initObject.textwidth || 30;
	this.inputElement;
	this.hasValue = false;
	this.regExp = initObject.regexp?new RegExp(initObject.regexp):null;
	this.example = initObject.example?initObject.example:null;
}

OpenPanel.GUIBuilder.FormElement.String.prototype = {
	
	
	resetValue : function(){
		this.value = null;
		this.hasValue = false;
		this.setHint();
		this.setValidity(true);
	},
	
	setValue : function(value, setInitialValue){
		if (value != undefined && value!="" && value.length>0) {
			this.value = value;
			
		} else {
			this.value = null;
			this.hasValue = false;
		}

		this.validate();
		
		if(setInitialValue == true){
			this.initialValue == true;
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
	}
}