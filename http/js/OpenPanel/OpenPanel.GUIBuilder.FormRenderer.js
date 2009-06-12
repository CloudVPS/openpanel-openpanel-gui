OpenPanel.GUIBuilder.FormRenderer = function(initObject){
	this.name = initObject.name;
	this.form;
	this.DOMParentElement;
	this.DOMElement;
}
		
OpenPanel.GUIBuilder.FormRenderer.prototype = {
	type : "reference",
	
	setForm : function(form){
		this.form = form;
	},
	
	render : function(){
		if(this.DOMElement != undefined){
			this.tbodyElement.innerHTML = "";
		} else {
			this.DOMElement = document.createElement("table");
			this.DOMElement.setAttribute("border", "1");
			this.DOMElement.setAttribute("id", this.form.name + "_" + this.type);
			this.tbodyElement = document.createElement("tbody");
			this.DOMElement.appendChild(this.tbodyElement);
		}
		
		for(var key in this.form.formElements){
			var formElement = this.form.formElements[key];
			if(formElement.isGrouped == true){
				var radioButtonElement = document.createElement("input");
				radioButtonElement.setAttribute("type", "radio");
				radioButtonElement.setAttribute("name", formElement.group);
				radioButtonElement.onfocus = function(){ 

				};
			} else {
				var radioButtonElement;	
			}
			
			var label = formElement.renderLabel();
			var field = formElement.renderField();
			
			var row = document.createElement("tr");
			var labelTD = document.createElement("td");
			labelTD.appendChild(label);
			var fieldTD = document.createElement("td");
			fieldTD.appendChild(field);
			
			row.appendChild(labelTD);
			row.appendChild(fieldTD);
			this.tbodyElement.appendChild(row);
			//console.log(formElement);
		}
		return this.DOMElement;
	},
	
	renderToDOMParentElement : function(){
		if(this.DOMParentElement!=undefined){
			this.render();
			this.DOMParentElement.appendChild(this.DOMElement);
		}
	},
	
	setDOMParentElement : function(DOMParentElement){
		this.DOMParentElement = DOMParentElement;
	}
}