OpenPanel.GUIBuilder.Widget.TextField = function(){  
	this.inputElement = {};
}

OpenPanel.GUIBuilder.Widget.TextField.prototype = {
 	
	init : function(initObject){
		this.$super.init(this, initObject);
		console.log("I'm a textfield object");
	},
	
	buildFields: function(){
		this.fieldElementContainer = document.createElement("div");
		this.fieldElementContainer.setAttribute("class", "fieldElementContainer");
		this.fieldElement = document.createElement("div");
		this.fieldElement.setAttribute("class", "fieldElement");
		this.fieldElementContainer.appendChild(this.fieldElement);
		
		this.inputElement = document.createElement("INPUT");
		this.inputElement.setAttribute("type", "text");
		this.fieldElement.appendChild(this.inputElement);	
		
	},
	
	setValue: function(someValue){
		this.inputElement.value = someValue;
	},
	
	getValue: function(){
		return this.inputElement.value;
	}
	
	
	
}