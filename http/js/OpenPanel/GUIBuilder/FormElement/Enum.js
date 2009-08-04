OpenPanel.GUIBuilder.FormElement.Enum = function(name, form, initObject){
	OpenPanel.GUIBuilder.FormElement.Base.inherit(this, name, form, initObject);
	this.enumSet = new Object();
	this.hideAsterisk = true;
}

OpenPanel.GUIBuilder.FormElement.Enum.prototype = {
	setEnumSet : function(enumSet){
		this.enumSet = {};
		
		if(this.required != true){
			this.enumSet[undefined] = {
				description: "Choississez por favor"
			};
		}
		for(var key in enumSet){
			this.enumSet[key] = enumSet[key];
		}
		this.selectElement;
	},
	
	renderInputElement: function(){
		var divElement = document.createElement("div");
		if(this.readOnly == false){
			this.selectElement = document.createElement("div");
			/*this.selectElement.setAttribute("tabIndex", OpenPanel.GUIBuilder.FormElement.Base.getNextTabIndex());
			var hook = this;
			this.selectElement.onchange = function(){
				hook.setValue(this.value);
			}
			var i = 0;
			for(var enumName in this.enumSet){
				var enumSetElement = this.enumSet[enumName];
				var optionElement = document.createElement("option");
				optionElement.setAttribute("value", enumName);
				optionElement.appendChild(document.createTextNode(enumSetElement.description));
				enumSetElement.index = i;
				this.selectElement.appendChild(optionElement);
			}*/
		} else {
			this.selectElement = document.createElement("div");
			this.selectElement.className = "stringElementDisabled";
			this.disable();
		}
		//var m = document.createElement("div");
		//m.innerHTML = "SELECT";
		//divElement.appendChild(m);
		var hook = this;
		//m.onclick = function(){
		//	hook.createMenu.show();	
		//}
		var dropDownButton = document.createElement("div");
		dropDownButton.className = "dropDownButton";
		
		var btleft = document.createElement("div");
		btleft.className = "dropDownButtonLeft";
		
		this.btmid = document.createElement("div");
		this.btmid.id = "btmid";
		this.btmid.className = "dropDownButtonCenter";
		this.btmid.innerHTML = "Dropdown menus rule the planet";
		var btright = document.createElement("div");
		btright.id = "btright";
		btright.className = "dropDownButtonRight";
		var menuLayer = document.createElement("div");
		menuLayer.id = "menulayer";
		
		dropDownButton.appendChild(btleft)
		dropDownButton.appendChild(this.btmid);
		dropDownButton.appendChild(btright);
		dropDownButton.appendChild(menuLayer);
		dropDownButton.onclick = function(){
			hook.createMenu.show();
		}
		
		this.selectElement.appendChild(dropDownButton);
		divElement.appendChild(this.selectElement);
		
		
		
		
		for(var key in this.enumSet){
			this.setValue(key, true);
			break;
		}	
		
		this.createMenu = new OpenPanel.GUIBuilder.GUIElements.DropDownMenu();

		this.createMenu.create(divElement, -17);
		this.menuCallbacks = {};
		var itemData = {};
		
		for (key in this.enumSet) {
			itemData[key] = this.enumSet[key].description;
			this.menuCallbacks[key] = this.enumSet[key];
		}
		
		this.createMenu.itemData = itemData;
		this.createMenu.build();
		this.createMenu.onselect = function(id) {
			hook.setValue(id);
		}
		
		return divElement;
	},
	
	getValue : function(){
		return this.value;
	},
	
	resetValue : function(){
		for (var enumName in this.enumSet) {
			this.setValue(enumName);
			break;
		}
	},
	
	setValue : function(value, setInitialValue) {
		
		if (this.readOnly == false) {
			if (this.selectElement != undefined) {
				this.selectElement.value = value;
			}
		} else {
			if (this.selectElement != undefined) {
				this.selectElement.innerHTML = value;
			}
		}
		if(this.btmid!=undefined && this.enumSet!=undefined && this.enumSet[value]!= undefined){
			this.btmid.innerHTML = this.enumSet[value].description;
		}
		
		
		
		if(value == "undefined"){
			value = undefined;
		}
		this.hasValue = true;
		this.value = value;
		if(setInitialValue == true){
			this.initialValue = this.value;
		}
		this.onChange();
	},
	
	enable : function(){
		this.selectElement.removeAttribute("disabled");
	},
	
	disable : function(){ 
		this.selectElement.setAttribute("disabled", true); 
	},
	
	validate : function(){
		var isValid = true;
		
		this.setValidity(isValid);
		return this.isValid;
	}
}
