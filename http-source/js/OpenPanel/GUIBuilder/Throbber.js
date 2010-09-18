/**
 * @author jp
 */
OpenPanel.GUIBuilder.Throbber = {
	targetDiv : {},
	
	start : function(){
		var imageUrl = "/images/gui/newThrobber.gif";
		this.targetDiv.innerHTML = "<img src=\""+imageUrl+"\"/>";
	},
	
	stop: function(){},
	
	setTargetDiv : function(targetDiv){
		this.targetDiv = targetDiv;
	}
}
		
