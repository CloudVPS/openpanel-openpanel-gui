/**
 * @author jp
 */

OpenCore.RPC = {
	sessionId: ""
}

OpenCore.RPC.RPCError = function(message, status){
	var err = new Error(message)
    // take care of IE5/5.5
    if (!err.message) {
        err.message = message
    }
	
	if(status != ""){
		err.status = status;
	} else {
		err.status = "";
	}
	
    err.name = "RPCError"
    return err;
}

OpenCore.RPC.RequestHandler = {
	openCoreURL	: "http://localhost/fake-opencore-proxy/json",
	asynchronizedRequestCount : 0,
	
	setOpenCoreURL: function(openCoreURL){
		this.openCoreURL = openCoreURL;
	},
	
	synchronizedRequest : function(sendVarsObject){
		
		var response = new Ajax.Request(this.openCoreURL, {
		  method: 'post',
		  asynchronous: false,
		  postBody: Object.toJSON(sendVarsObject),
		  contentType: "application/json"
		}).transport;
		
		var responseText = response.responseText;
		
		if(response.status != 200){
			throw OpenCore.RPC.RPCError(OpenCore.RPC.HTTPStatus.getStatus(response.status), response.status);
		}
		
		return responseText;
	},
	
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
		new Ajax.Request(hook.openCoreURL, {
		  method: 'post',
		  postBody: Object.toJSON(sendVarsObject),
		  contentType: "application/json",
		  onComplete : function(xhr){
			xhr.argument = arg;
		  	hook.asynchronizedRequestReturn(xhr);
		  },
		  onFailure : function(){
			 xhr.argument = arg;
			 hook.asynchronizedRequestReturn(xhr);
		  },
		  argument: arg
		});
	},
	
	asynchronizedRequestReturn : function(requestResult){
		
		try {
			if(requestResult.status != 200){
				throw OpenCore.RPC.RPCError(OpenCore.RPC.HTTPStatus.getStatus(requestResult.status), requestResult.status);
			}
			
			OpenCore.RPC.RequestHandler.asynchronizedRequestCount--;
			if(requestResult.argument != undefined && requestResult.argument.callBackObject != undefined){
				var callBackObject = requestResult.argument.callBackObject;
				var callBackFunction = requestResult.argument.callBackFunction;
				var callBackArguments = requestResult.argument.callBackArguments;
				callBackArguments.data = requestResult.responseText.evalJSON();
			
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

OpenCore.RPC.HTTPStatus = {
	
	lookup : {
		100 : "Continue",
		101 : "Switching Protocols",
		200 : "OK",
		201 : "Created",
		202 : "Accepted",
		203 : "Non-Authoritative Information",
		204 : "No Content",
		205 : "Reset Content",
		206 : "Partial Content",
		300 : "Multiple Choices",
		301 : "Moved Permanently",
		302 : "Found",
		303 : "See Other",
		304 : "Not Modified",
		305 : "Use Proxy",
		306 : "(Unused)",
		307 : "Temporary Redirect",
		400 : "Bad Request",
		401 : "Unauthorized",
		402 : "Payment Required",
		403 : "Forbidden",
		404 : "Not Found",
		405 : "Method Not Allowed",
		406 : "Not Acceptable",
		407 : "Proxy Authentication Required",
		408 : "Request Timeout",
		409 : "Conflict",
		410 : "Gone",
		411 : "Length Required",
		412 : "Precondition Failed",
		413 : "Request Entity Too Large",
		414 : "Request-URI Too Long",
		415 : "Unsupported Media Type",
		416 : "Requested Range Not Satisfiable",
		417 : "Expectation Failed",
		500 : "Internal Server Error",
		501 : "Not Implemented",
		502 : "Bad Gateway",
		503 : "Service Unavailable",
		504 : "Gateway Timeout",
		505 : "HTTP Version Not Supported"
	},
	
	getStatus : function (statusCode) {
		var status = this.lookup[statusCode];
		if(status != undefined){
			return status;
		} else {
			return "Unknown error (" + statusCode + ")";
		}
	}
}

