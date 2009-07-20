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
			throw RPCError(HTTPStatus.getStatus(response.status), response.status);
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

		jQuery.ajax({
			url: hook.openCoreURL,
			type: "POST",
			dataType: "json",
			async: true,
			data: jQuery.toJSON(sendVarsObject),
			complete: function(xhr){
				xhr.argument = arg;
				hook.asynchronizedRequestReturn(xhr)
			},
			argument : arg
		});
	},
	
	asynchronizedRequestReturn : function(requestResult){
		try {
			if(requestResult.status != 200){
				throw RPCError(HTTPStatus.getStatus(requestResult.status), requestResult.status);
			}
			
			OpenCore.RPC.RequestHandler.asynchronizedRequestCount--;
			if(requestResult.argument != undefined && requestResult.argument.callBackObject != undefined){
				var callBackObject = requestResult.argument.callBackObject;
				var callBackFunction = requestResult.argument.callBackFunction;
				var callBackArguments = requestResult.argument.callBackArguments;
				callBackArguments.data = jQuery.parseJSON(requestResult.responseText);
				
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
		} catch (e){
			OpenPanel.Controller.handleErrors(e);
		}
	},
	
	startLoading : function(){ },
	
	doneLoading : function(){ }
	
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

