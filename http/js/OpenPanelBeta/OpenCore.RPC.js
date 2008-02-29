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
	/*
	
	async stuff, post beta
	##
	usage: 
	OpenCore.RPC.RequestHandler.getRecordsAsync(
		this.controller.action, 
		{
			command: "LoginDone"
		}
	);
	##
					
	 
	asynchronizedRequest : function(sendVarsObject, callBack, callBackArguments){
		var hook = this;
		console.log("show throbber");
		OpenPanel.GUIBuilder.showLoadingDiv();
		Ext.Ajax.request({
			url: hook.openCoreURL,
			success: hook.asynchronizedRequestReturn,
			failure: hook.asynchronizedRequestReturn,
			jsonData: jQuery.toJSON(sendVarsObject),
			argument : {
				callBack : callBack, 
				callBackArguments: callBackArguments
			}
		});
	},
	
	asynchronizedRequestReturn : function(requestResult){
		if(requestResult.argument != undefined && requestResult.argument.callBack != undefined){
			var callBack = requestResult.argument.callBack;
			var callBackArguments = requestResult.argument.callBackArguments;
			callBackArguments.data = Ext.util.JSON.decode(requestResult.responseText);
			if(callBackArguments!=undefined){
				callBack(callBackArguments);
			} else {
				callBack();
			}
		}
		console.log("hide throbber");
		OpenPanel.GUIBuilder.hideLoadingDiv();
	},
	
	getRequestResultAsync: function(sendVarsObject, callBack, callBackArguments){
		var callBackWrapper = {
			callBack : callBack,
			callBackArguments : callBackArguments
		}
		this.asynchronizedRequest(sendVarsObject, this.getRequestResultAsyncDone, callBackWrapper);
	},
	
	getRequestResultAsyncDone : function(callBackWrapper){
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
		this.getRequestResultAsync(r, this.getRecordsAsyncDone, callBackWrapper);
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

