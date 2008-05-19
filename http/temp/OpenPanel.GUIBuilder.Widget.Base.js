OpenPanel.GUIBuilder.Widget.Base = function(){
	this.fieldElementContainer = {};
	this.formElementLabel = {};
	this.fieldElement = {};
	this.parameter = {};
	this.needed = false;
};

OpenPanel.GUIBuilder.Widget.Base.prototype = {
 	
	init : function(childObject, initObject){ 
		console.log("I'm a base object"); 
	},
	
	setParentElement : function(domElement){
		this.parentElement = domElement;
	},
	
	build : function(){
		this.buildLabel();
		this.buildFields();
	},
	
	buildLabel : function(){
		this.formElementLabel = document.createElement("div");
		this.formElementLabel.setAttribute("class", "formElementLabel");
		this.formElementLabel.appendChild(document.createTextNode(this.parameter.label));
	},
	
	buildFields : function(){
		this.fieldElementContainer = document.createElement("div");
		this.fieldElementContainer.setAttribute("class", "fieldElementContainer");
		this.fieldElement = document.createElement("div");
		this.fieldElement.setAttribute("class", "fieldElement");
		this.fieldElementContainer.appendChild(this.fieldElement);
	},
	
	onChange : function(){},
	onSubmit : function(){},
	
	clean : function(){},
	
	setValue : function(someValue){
		this.fieldElement.innerHTML = someValue;	
		
	},
	
	getValue : function(){ return 1},
	
	enable : function(){},
	disable : function(){},
	
	getCanSubmit : function(){},
	
	getElement : function(){
		return this.element;
	},
	
	setFieldNotValid : function(){
		this.formElementLabel.setAttribute("class", "badField");
	},
	
	setFieldValid : function(){
		this.formElementLabel.setAttribute("class", "formElementLabel");
	},
	
	setNeeded : function(bool){
		this.needed = bool;
	},
	
	getNeeded : function(){
		return this.needed;
	}
}
