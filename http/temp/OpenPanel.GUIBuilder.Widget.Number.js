OpenPanel.GUIBuilder.Widget.Number = function(){ }

OpenPanel.GUIBuilder.Widget.Number.prototype = {
 	
	init : function(initObject){
		this.$super.init(this, initObject);
		console.log("I'm a Number object");
	}
}