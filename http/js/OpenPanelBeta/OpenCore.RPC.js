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
	 
	asynchronizedRequest : function(sendVarsObject, callBackObject, callBackFunction, callBackArguments){
		this.asynchronizedRequestCount++;
		OpenCore.RPC.RequestHandler.startLoading();
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
			for(var key in callBackFunction){
				console.log(key + " " + callBackFunction[key]);
			}
			
			if (callBackFunction == undefined) {
				throw Error("callBackFunction does not exist");
				return;
			} else {
				if (callBackArguments != undefined) {
					console.log("with arguments");
					callBackObject[callBackFunction](callBackArguments);
				} else {
					console.log("without arguments");
					callBackObject[callBackFunction]();
				}
			}
		}
		console.log("his.asynchronizedRequestCount " + OpenCore.RPC.RequestHandler.asynchronizedRequestCount);
		if (OpenCore.RPC.RequestHandler.asynchronizedRequestCount == 0) {
			OpenCore.RPC.RequestHandler.doneLoading();
		}
	},
	
	startLoading : function(){
		
	},
	
	doneLoading : function(){
		
	},
	/*
	getRequestResultASync: function(sendVarsObject, callBack, callBackArguments){
		var callBackWrapper = {
			callBack : callBack,
			callBackArguments : callBackArguments
		}
		this.asynchronizedRequest(sendVarsObject, this.getRequestResultASyncDone, callBackWrapper);
	},
	
	getRequestResultASyncDone : function(callBackWrapper){
		if(callBackWrapper != undefined){
			var callBack;
			var callBackArguments;
			var data;
			
			if(callBackWrapper.callBack != undefined){
				callBack = callBackWrapper.callBack;
			}
			
			if(callBackWrapper.callBackArguments != undefined){
				callBackArguments = callBackWrapper.callBackArguments;
			}
			
			if(callBackWrapper.data != undefined){
				data = callBackWrapper.data.body.data;
			}
			
			callBackArguments.data = data;
			
			if(callBack!= undefined){
				callBack(callBackArguments);
			}
		}
	},
	
	getRecordsAsync : function(callBack, callBackArguments){
		var r = new OpenCore.RPC.SendVars();
		r.addHeader("command", "getrecords");
		r.addHeader("session_id", OpenCore.DataManager.sessionId);
		r.addBody("classid", "User");
		console.log("getRecordsAsync");
		console.log(r);
		
		console.log(callBackArguments);
		
		var callBackWrapper = {
			callBack : callBack,
			callBackArguments : callBackArguments
		}
		this.getRequestResultASync(r, this.getRecordsAsyncDone, callBackWrapper);
	},
	
	getRecordsAsyncDone : function(callBackWrapper){
		
		var callBack;
			var callBackArguments;
			var data;
			
			if(callBackWrapper.callBack != undefined){
				callBack = callBackWrapper.callBack;
			}
			
			if(callBackWrapper.callBackArguments != undefined){
				callBackArguments = callBackWrapper.callBackArguments;
			}
			
			if(callBackWrapper.data != undefined){
				data = callBackWrapper.data;
			}
			
			callBackArguments.data = data;
			
			if(callBack!= undefined){
				callBack(callBackArguments);
			}
	}
	*/
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

