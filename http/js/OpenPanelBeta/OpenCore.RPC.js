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
	},
	
	asynchronizedRequest : function(sendVarsObject, callback){
		var hook = this;
		Ext.Ajax.request({
			url: hook.openCoreURL,
			success: hook.asynchronizedRequestReturn,
			failure: hook.asynchronizedRequestReturn,
			jsonData: jQuery.toJSON(sendVarsObject),
			argument : {callback : callback}
		});
		
	},
	
	asynchronizedRequestReturn : function(requestResult){
		console.log(requestResult);
		if(requestResult.argument != undefined && requestResult.argument.callback != undefined){
			var callback = requestResult.argument.callback;
			callback(callbackArgument, callbackOptionalArgument);
		}
	},
	
	test : function(callback, callbackArgument, callbackOptionalArgument){
		var r = new OpenCore.RPC.SendVars();
		r.addHeader("command", "bind");
		r.addBody("data", {id: "foobar"});
		r.addBody("classid", "User");
		r.addBody("id", "openadmin");
		this.asynchronizedRequest(r, callback, callbackArgument ,callbackOptionalArgument);
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

