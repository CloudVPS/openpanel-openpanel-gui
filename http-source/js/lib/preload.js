var bgimage = new Image(32,32);
bgimage.src = "/images/gui/loadingbackground.png";
var crowimage = new Image(32,32);
crowimage.src = "/images/gui/crow.png";
var spinner = new Image(32,32);
spinner.src = "/images/gui/prespinner.gif";
		
new Ajax.Request("/dynamic/imagelist.json", {
	  method:"get",
	  onSuccess : function(transport){
		var assetList = transport.responseText.evalJSON();
		var a = {};
		assetList.each(function(assetSource){
			a[assetSource] = new Image(32, 32);
			a[assetSource].src = assetSource;
			console.log(assetSource);
		});
	  }
});