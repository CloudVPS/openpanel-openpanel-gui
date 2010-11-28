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
		var a = {};
		assetList.each(function(src){
			a[src] = new Image(32, 32);
			a[src].src = src;
			console.log(src);
		});
		
		this.finish();
	},
	
	finish : function(){
		if(this.nextAction){
			var that = this;
			Event.observe(window, 'load', function() {
				that.controller.action(that.nextAction);
			});
		}
	}
}
