OpenPanel.GUIBuilder.Widget.Base = function(){
	this.fieldElementContainer = {};
	this.formElementLabel = {};
	this.fieldElement = {};
	this.groupElement = {};
	this.parameter = {};
	this.needed = false;
	this.isGrouped = false;
	this.groupName = "";
	this.isValid = true;
	
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
		this.buildRadioButtons();
		this.buildFields();
		this.buildExtras();
	},
	
	buildLabel : function(){
		this.formElementLabel = document.createElement("div");
		this.formElementLabel.setAttribute("class", "formElementLabel");
		this.formElementLabel.appendChild(document.createTextNode(this.parameter.label));
	},
	
	buildRadioButtons : function(){
		if(this.isGrouped == true){
			var group = OpenPanel.GUIBuilder.Widget.groups[this.groupName];
			this.groupElement = document.createElement("INPUT");
			this.groupElement.setAttribute("type", "radio");
			this.groupElement.setAttribute("name", this.groupName);
			var hook = this;
			this.groupElement.onclick = function(){
				OpenPanel.GUIBuilder.Widget.onFocus(hook);
			}
		}	
	},
	
	buildFields : function(){
		this.fieldElementContainer = document.createElement("div");
		this.fieldElementContainer.setAttribute("class", "fieldElementContainer");
		this.fieldElement = document.createElement("div");
		this.fieldElement.setAttribute("class", "fieldElement");
		this.fieldElementContainer.appendChild(this.fieldElement);
	},
	
	buildExtras : function(){ },
	
	onchange : function(){
		OpenPanel.GUIBuilder.Widget.onChange(this);
	},
	
	onfocus : function(){
		OpenPanel.GUIBuilder.Widget.onFocus(this);
	},
	
	onSubmit : function(){},
	
	clean : function(){},
	
	setValue : function(someValue){
		this.fieldElement.innerHTML = someValue;	
	},
	
	getValue : function(){ return 1 },
	
	enable : function(){ },
	
	disable : function(){ },
	
	enableGroup : function() {
		this.groupElement.setAttribute("checked", "checked");
	},
	
	disableGroup: function() {
		this.groupElement.removeAttribute("checked");
	},
	
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
	},
	
	validate : function(){
		return true;
	},
	
	setChanged : function(){
		OpenPanel.GUIBuilder.Widget.setChanged(this);
	}
}
