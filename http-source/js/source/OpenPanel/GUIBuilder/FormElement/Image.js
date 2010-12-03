OpenPanel.GUIBuilder.FormElement.Image = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.width=192;
	this.height=120;
	this.inputElement;
	this.hasValue = false;
	this.canHasFocus = false;
	this.regExp = null;
	this.example = null;
}

OpenPanel.GUIBuilder.FormElement.Image.prototype = {
	renderInputElement : function(){
		var divElement = document.createElement("div");
		this.inputElement = document.createElement("img");
		this.inputElement.setAttribute("src",this.value);
		this.inputElement.setAttribute("width",this.width);
		this.inputElement.setAttribute("height",this.height);
		this.inputElement.setAttribute("border",1);
		this.inputElement.style.marginTop = "4px";
		this.inputElement.style.borderColor = "black";
		this.inputElement.style.borderWidth = "1px";
		this.inputElement.style.borderStyle = "solid";
		divElement.appendChild(this.inputElement);
		return divElement;
		this.disable();
	},
	
	setStyle : function(){
		this.setStyleWidth();
	},
	
	setHintStyle: function(){
	},
	
	setStyleWidth : function(){
		this.inputElement.setAttribute("width",this.width);
	},
	
	focus : function(){
	},
	
	onBlur : function(){
	},
	
	setHint : function(){
	},
	
	onFocus : function(){
	},
	
	resetValue : function(){
	},
	
	setValue : function(value, setInitialValue){
		if (value != undefined && value!="" && value.length>0) {
			this.value = value;
			this.inputElement.setAttribute("src",this.value);
		}
	},
	
	getValue : function(){
		return "";
	},
	
	validate : function(){
		return true;
	},
	
	enable : function(){
	},
	
	disable : function(){
	}
}

	
	
		