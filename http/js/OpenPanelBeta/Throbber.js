var Throbber = {
	targetDiv : {},
	
	start : function(){
		var imageUrl = "/images/gui/newTrobber.gif";
		this.targetDiv.innerHTML = "<img src=\""+imageUrl+"\"/>";
	},
	
	setTargetDiv : function(targetDiv){
		this.targetDiv = targetDiv;
		this.targetDiv.setAttribute("class", "throbber");
	}
}
		