/**
 * @author jp
 */

OpenCore.RPC = {
	sessionId: ""
}


OpenCore.RPC.RequestHandler = {
	openCoreURL	: "http://localhost:8888/fake-opencore-proxy/json",
	
	setOpenCoreURL: function(openCoreURL){
		this.openCoreURL = openCoreURL;
	},
	
	synchronizedRequest : function(sendVarsObject){
		
		var f = $j.ajax(
			{ type: "POST",
			  url: this.openCoreURL,
			  async: false,
			  dataType: "json",
			  data: jQuery.toJSON(sendVarsObject)
			}
		).responseText;
		
		return f;
	}
}
		 
OpenCore.RPC.SendVars = function(){
	this.header = { };
	this.body = {};
	this.init();
}

OpenCore.RPC.SendVars.prototype = {
	init : function(args){},
	
	addHeader : function(headerName, headerValue){
		this.header[headerName] = headerValue;
	},
	
	addBody : function(bodyName, bodyValue){
		this.body[bodyName] = bodyValue;
	}
}
