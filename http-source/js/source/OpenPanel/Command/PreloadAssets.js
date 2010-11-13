OpenPanel.Command.PreloadAssets  = {
	controller : {},
	execute : function(actionObject){
		var url = "/dynamic/imagelist.json";
		var that = this;
		new Ajax.Request(url, {
			  method:"get",
			  onSuccess : that.loadDone.bind(that)
		});
	},
	
	loadDone : function(transport){
		var assetList = transport.responseText.evalJSON();
		assetList.each(function(src){
			var i = new Image(32,32);
			i.src = src;
		});
		
		this.finish();
	},
	
	finish : function(){
		if(this.nextAction){
			this.controller.action(this.nextAction);
		}
	}
}
