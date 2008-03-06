/**
 * @author jp
 */

OpenCore.RPC = {
	sessionId: ""
}


OpenCore.RPC.RequestHandler = {
	openCoreURL	: "http://localhost:8888/fake-opencore-proxy/json",
	asynchronizedRequestCount : 0,
	
	setOpenCoreURL: function(openCoreURL){
		this.openCoreURL = openCoreURL;
	},
	
	synchronizedRequest : function(sendVarsObject){
		var response = $j.ajax(
			{ type: "POST",
			  url: this.openCoreURL,
			  async: false,
			  dataType: "json",
			  data: jQuery.toJSON(sendVarsObject)
			}
		);
		var responseText = response.responseText;
		if(response.status != 200){
			throw RPCError(response.statusText, response.status);
			
		}
		return responseText;
	},
	/*
	
	async stuff, post beta
	
	usage: 
	OpenCore.RPC.RequestHandler.getRecordsAsync(
		this.controller.action, 
		{
			command: "LoginDone"
		}
	);
	
	*/			
	 
	asynchronizedRequest : function(sendVarsObject, callBackObject, callBackFunction, callBackArguments, background){
		this.asynchronizedRequestCount++;
		if (background == undefined) {
			OpenCore.RPC.RequestHandler.startLoading();
		}
		var arg = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments: callBackArguments
		}
		var hook = this;
		Ext.Ajax.request({
			url: hook.openCoreURL,
			success: this.asynchronizedRequestReturn,
			failure: this.asynchronizedRequestReturn,
			jsonData: jQuery.toJSON(sendVarsObject),
			argument : arg
		});
	},
	
	asynchronizedRequestReturn : function(requestResult){
		OpenCore.RPC.RequestHandler.asynchronizedRequestCount--;
		if(requestResult.argument != undefined && requestResult.argument.callBackObject != undefined){
			var callBackObject = requestResult.argument.callBackObject;
			var callBackFunction = requestResult.argument.callBackFunction;
			var callBackArguments = requestResult.argument.callBackArguments;
			callBackArguments.data = Ext.util.JSON.decode(requestResult.responseText);
			
			if (callBackFunction == undefined) {
				throw Error("callBackFunction does not exist");
				return;
			} else {
				if (callBackArguments != undefined) {
					callBackObject[callBackFunction](callBackArguments);
				} else {
					callBackObject[callBackFunction]();
				}
			}
		}
		if (OpenCore.RPC.RequestHandler.asynchronizedRequestCount == 0) {
			OpenCore.RPC.RequestHandler.doneLoading();
		}
	},
	
	startLoading : function(){ },
	
	doneLoading : function(){ },
	
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

