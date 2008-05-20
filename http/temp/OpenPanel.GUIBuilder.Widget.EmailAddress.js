OpenPanel.GUIBuilder.Widget.EmailAddress = function(){  
	this.emailDomain = "";
	this.extraElement;
}

OpenPanel.GUIBuilder.Widget.EmailAddress.prototype = {
 	
	init : function(initObject){
		this.$super.init(this, initObject);
		var t = new OpenPanel.GUIBuilder.Widget.TextField();
		OpenPanel.GUIBuilder.Widget.override(t, this);
		if(this.parameter.emailDomain != undefined){
			this.emailDomain = this.parameter.emailDomain;
		}
		this.setRegExp("^[^%@ ]+$");
	},
	
	buildExtras : function(){
		this.extraElement = document.createElement("DIV");
		this.extraElement.appendChild(document.createTextNode("@" + this.emailDomain));
	}
}