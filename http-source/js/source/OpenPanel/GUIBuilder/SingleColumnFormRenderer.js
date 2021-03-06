OpenPanel.GUIBuilder.SingleColumnFormRenderer = function(initObject){
	this.name = initObject.name;
	this.form;
	this.DOMParentElement;
	this.DOMElement;
}
		
OpenPanel.GUIBuilder.SingleColumnFormRenderer.prototype = {
	type : "SingleColumnFormRenderer",
	
	setForm : function(form){
		this.form = form;
	},
	
	render : function(){
		if(this.DOMElement != undefined){
			this.tbodyElement.innerHTML = "";
		} else {
			this.DOMElement = document.createElement("table");
			this.DOMElement.setAttribute("border", "0");
			this.DOMElement.setAttribute("width", "100%");
			this.DOMElement.setAttribute("id", this.form.name + "_" + this.type);
			this.DOMElement.className = "formTable";
			
			this.tbodyElement = document.createElement("tbody");
			this.DOMElement.appendChild(this.tbodyElement);
		}
		
		var hook = this;
		var formElement;
		
		for(var i = 0;i<this.form.formElements.length;i++){
			formElement = this.form.formElements[i];
			var label;
			if (formElement.isGrouped == false) {
				label = formElement.renderLabel();
			} else {
				if (formElement.isFirstInGroup == true) {
					label = document.createElement("div");
					label.innerHTML = formElement.group;
				} else {
					label = document.createElement("div");
					label.innerHTML = "&nbsp;";
				}
				label.className = "labelElement";
			}
			
			var field = formElement.renderField();
			
			if (formElement.sameline != true) {
				var row = document.createElement("tr");
				if (formElement.paddingtop != 0)
				{
					var trow = document.createElement("tr");
					var ttd = document.createElement("td");
					ttd.colSpan = 2;
					var tdiv = document.createElement("div");
					tdiv.setStyle({
						height: formElement.paddingtop + "px"
					});
					
					ttd.appendChild(tdiv);
					trow.appendChild(ttd);
					this.tbodyElement.appendChild(trow);
				}
				
				var fieldTD = document.createElement("td");

				if (formElement.breakcolumn != true) {
					var labelTD = document.createElement("td");
					labelTD.className = "labelTd";
					labelTD.setAttribute("valign", "top");
					labelTD.appendChild(label);
					row.appendChild(labelTD);
				} else {
					fieldTD.colSpan = 2;
				}

				var sameLineDiv = document.createElement("span");
				sameLineDiv.show();
				fieldTD.appendChild(sameLineDiv);
				var container = document.createElement("div");
				container.className = "elementContainer";
				container.appendChild(field);
				
				sameLineDiv.appendChild(container);
				row.appendChild(fieldTD);
			} else {
				var container = document.createElement("div");
				container.className = "elementContainer";
				label.style.cssText = "padding-left: 4px; float: left; text-align: right;";
				if (formElement.labelwidth != 0)
				{
					label.style.width = "" + formElement.labelwidth + "px";
				}
				container.appendChild(label);
				container.appendChild(field);
				sameLineDiv.appendChild(container);
				field.style.cssText = "float: left;";
			}
			this.tbodyElement.appendChild(row);
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
