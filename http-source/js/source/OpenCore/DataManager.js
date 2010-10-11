/**
 * @author jp
 */
OpenCore.DataManager = {
	guiBuilder: {},
	controller: {},
	rpc: {},	
	classInfos: undefined,
	sessionId: "",
	openCoreObjects: {},
	rootObject: {},
	errorId: 0,
	errorMessage: "",
	quotaObject : {},
	quotaByClassName : {},
	
	
	setGuiBuilder: function(guiBuilder){
		this.guiBuilder = guiBuilder;
	},
	setController: function(controller){
		this.controller = controller;
	},
	setRPC: function(rpc){
		this.rpc = rpc;
	},
	
	
	login: function(userName, password){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "bind");
		r.addBody("data", {id: password});
		r.addBody("classid", "User");
		r.addBody("id", userName);
		var requestResult = this.getRequestResult(r);
		
		if(requestResult.header!=undefined && requestResult.header.session_id != undefined){
			this.sessionId = requestResult.header.session_id;
			return true;
		}
		return false;
	},
	
	loginAsync: function(userName, password, callBackObject, callBackFunction, callBackArguments){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "bind");
		r.addBody("data", {id: password});
		r.addBody("classid", "User");
		r.addBody("id", userName);
		var callBackWrapper = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments : callBackArguments
		}
		this.getRequestResultAsync(r, OpenCore.DataManager, "loginAsyncDone", callBackWrapper);
	},
	
	loginAsyncDone : function getInstancesByParentUUIDAsyncDone(callBackWrapper){
		var callBackObject;
		var callBackFunction;
		var callBackArguments = {};
		var data;
		
		if(callBackWrapper.callBackObject != undefined){
			callBackObject = callBackWrapper.callBackObject;
		}
		
		if(callBackWrapper.callBackFunction != undefined){
			callBackFunction = callBackWrapper.callBackFunction;
		}
		
		if(callBackWrapper.callBackArguments != undefined){
			callBackArguments = callBackWrapper.callBackArguments;
		}
		
		if(callBackWrapper.data != undefined){
			data = callBackWrapper.data;
			callBackArguments.data = data;
		}
		
		var header = callBackWrapper.header;
		if(header.errorid == 0){
			this.sessionId = callBackWrapper.header.session_id;
		}
		
		if(callBackFunction == undefined){
			throw new Error("callBackFunction is undefined");
		} else {
			callBackObject[callBackFunction](data, callBackWrapper);
		}
		
	},
	initializeQuotaObject : function(){
		new OpenCore.DataManager.OpenCoreObject("ROOT", "User");
		this.quotaObject =  new OpenCore.DataManager.OpenCoreObject("User", "OpenCORE:Quota")
		this.quotaObject.getInstances();
		for(var metaid in this.quotaObject.instances){
			this.quotaByClassName[this.quotaObject.instances[metaid].metaid] = this.quotaObject.instances[metaid];		
		}
	},
	
	checkQuotum : function(className){
		var quotum = this.quotaByClassName[className];
		if(quotum==undefined){
			return true;
		} else {
			if(quotum.usage < quotum.quota || quotum.quota == -1){
				return true;
			} else {
				return false;
			}
		}
	},
	
	getQuotumByClassName : function(className){
		var quotum = this.quotaByClassName[className];
		return quotum;
	},
	
	logOut : function(){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "logout");
		r.addHeader("session_id", this.sessionId);
		
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined 
		&& requestResult.body.data != undefined 
		&& requestResult.body.data[className] != undefined) {
			return requestResult.body.data;
		}
	},
	
	getClassInfo: function(className){
		
		if(this.classInfos == undefined || className == "ROOT"){
			var g = this.getWorld();
			try {
				if(g.body != undefined && g.body.data != undefined && g.body.data.body!=undefined && g.body.data.body.classes != undefined){
					this.classInfos = g.body.data.body.classes;
				} else {
					throw new Exception("ClassInfo was not found");
				}
			} catch (e) {
				alert(e);
			}
		}
		
		if(className == "ROOT"){
			var rootClassInfo = {
				info: {
					children: {}
				}
			};
			
			for(var c in this.classInfos){
				
				var classInfo = this.classInfos[c];
				if (classInfo.info == undefined || (classInfo.info && classInfo.info.parent == undefined)) {
					rootClassInfo.info.children[classInfo["class"].uuid] = {
						description		: classInfo["class"].description,
						id				: classInfo["class"].id,
						menuclass		: classInfo["class"].menuclass,
						shortname		: classInfo["class"].shortname
					}
				}
			}
			this.classInfos["ROOT"] = rootClassInfo;
		}
		
		return this.classInfos[className];
	},
	
	updateInstance: function(className, objectId, data){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "update");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectId);	
		r.addBody("data", data);
		
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined 
		&& requestResult.body.data != undefined 
		&& requestResult.body.data[className] != undefined) {
			return requestResult.body.data;
		}
	},
	
	updateInstanceAsync: function(className, objectId, data, callBackObject, callBackFunction, callBackArguments){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "update");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectId);	
		r.addBody("data", data);
		
		var callBackWrapper = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments : callBackArguments
		}
		
		this.getRequestResultAsync(r, OpenCore.DataManager, "updateInstanceAsyncDone", callBackWrapper);
	},
	
	updateInstanceAsyncDone : function(callBackWrapper){
		var callBackObject;
		var callBackFunction;
		var callBackArguments;
		var data;
		
		if(callBackWrapper.callBackObject != undefined){
			callBackObject = callBackWrapper.callBackObject;
		}
		
		if(callBackWrapper.callBackFunction != undefined){
			callBackFunction = callBackWrapper.callBackFunction;
		}
		
		if(callBackWrapper.callBackArguments != undefined){
			callBackArguments = callBackWrapper.callBackArguments;
		}
		
		if(callBackWrapper.data != undefined){
			data = callBackWrapper.data;
		}
		
		callBackArguments.data = data;
		callBackArguments.header = callBackWrapper.header;
		
		if(callBackObject!= undefined){
			callBackObject[callBackFunction](callBackArguments);
		}
	},
	
	createInstance : function(className, objectId, parentId, data){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "create");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectId);	
		r.addBody("parentId", parentId);
		r.addBody("data", data);
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined 
		&& requestResult.body.data != undefined 
		&& requestResult.body.data[className] != undefined) {
			return requestResult.body.data;
		}
	},
	
	getRecords: function(className){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecords");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined 
		&& requestResult.body.data != undefined 
		&& requestResult.body.data[className] != undefined) {
			return requestResult.body.data;
		}
	},
	
	
	
	getRecord : function(className, objectid){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecord");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectid);
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined 
		&& requestResult.body.data != undefined 
		&& requestResult.body.data.object != undefined) {
			return requestResult.body.data.object;
		}
		
	},
	
	
	getRecordAsync : function(className, objectId, callBackObject, callBackFunction, callBackArguments, background){
		
		var r = new OpenCore.RPC.SendVars();
		r.addHeader("command", "getrecords");
		r.addHeader("session_id", OpenCore.DataManager.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectId);
		var callBackWrapper = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments : callBackArguments
		}
		this.getRequestResultAsync(r, this, "getRecordsAsyncDone", callBackWrapper, background);
	},
		
	getReferences: function(refString){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getreferences");
		r.addHeader("session_id", this.sessionId);
		r.addBody("refstring", refString);
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined 
		&& requestResult.body.data != undefined) {
			return requestResult.body.data;
		}
	},
	
	getInstancesByParentUUID: function(className, parentid){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecords");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("parentid", parentid);
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined &&
		requestResult.body.data != undefined &&
		requestResult.body.data[className] != undefined) {
			
			return requestResult.body.data;
		}
	},
	
	getInstancesByParentUUIDAsync: function(className, parentid, callBackObject, callBackFunction, callBackArguments){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecords");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("parentid", parentid);
		
		var callBackWrapper = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments : callBackArguments
		}
		this.getRequestResultAsync(r, OpenCore.DataManager, "getInstancesByParentUUIDAsyncDone", callBackWrapper);
	},
	
	getInstancesByParentUUIDAsyncDone : function getInstancesByParentUUIDAsyncDone(callBackWrapper){
		var callBackObject;
		var callBackFunction;
		var callBackArguments = {};
		var data;
		
		if(callBackWrapper.callBackObject != undefined){
			callBackObject = callBackWrapper.callBackObject;
		}
		
		if(callBackWrapper.callBackFunction != undefined){
			callBackFunction = callBackWrapper.callBackFunction;
		}
		
		if(callBackWrapper.callBackArguments != undefined){
			callBackArguments = callBackWrapper.callBackArguments;
		}
		
		if(callBackWrapper.data != undefined){
			data = callBackWrapper.data;
			callBackArguments.data = data;
		}
		
		if(callBackFunction == undefined){
			throw new Error("callBackFunctionis undefined");
		} else {
			callBackObject[callBackFunction](data, callBackArguments);
		}
	},
	
	getRecordByObjectId: function(className, objectId){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecord");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectId);
		var requestResult = this.getRequestResult(r);
		return requestResult;
	},
	
	getWorld: function(className){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getworld");
		r.addHeader("session_id", this.sessionId);
		var requestResult = this.getRequestResult(r);
		return requestResult;
	},
	
	getRequestResult: function(sendVars){
		
			var r =this.rpc.RequestHandler.synchronizedRequest(sendVars).evalJSON();
			if(r.header != undefined && r.header.errorid != undefined && r.header.error !=undefined){
				this.errorId = r.header.errorid;
				this.errorMessage = r.header.error;
				
				if(this.errorId!=0){
					throw new OpenCore.OpenCoreError(r.header.error, r.header.errorid);
					return;
				}
				return r;
			} else {
				throw new OpenCore.RPC.RPCError("No response");
			}
		
	},
	
	getRequestResultAsync: function(sendVarsObject, callBackObject, callBackFunction, callBackArguments, background){
		var callBackWrapper = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments : callBackArguments
		}
		this.rpc.RequestHandler.asynchronizedRequest(sendVarsObject, OpenCore.DataManager, "getRequestResultAsyncDone", callBackWrapper, background);
	},
	
	getRequestResultAsyncDone : function getRequestResultAsyncDone(callBackWrapper){
		if(callBackWrapper != undefined){
			var callBackObject;
			var callBackFunction;
			var callBackArguments = {};
			var data;
			
			if(callBackWrapper.callBackObject != undefined){
				callBackObject = callBackWrapper.callBackObject;
			}
			
			if(callBackWrapper.callBackFunction != undefined){
				callBackFunction = callBackWrapper.callBackFunction;
			}
			
			if(callBackWrapper.callBackArguments != undefined){
				callBackArguments = callBackWrapper.callBackArguments;
			}
			
			if(callBackWrapper.data != undefined && callBackWrapper.data.body!=undefined && callBackWrapper.data.body.data !=undefined){
				data = callBackWrapper.data.body.data;
				callBackArguments.data = data;
			}
			
			callBackArguments.header = callBackWrapper.data.header;
			
			if (callBackFunction == "") {
				throw new Error("callBackFunction is not defined");
			} else {
				callBackObject[callBackFunction](callBackArguments);
			}
		} else {
			console.log("callBackWrapper undefined");
		}
		
	},
	
	getRecordsAsync: function(className, objectId, callBackObject, callBackFunction, callBackArguments, background){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecords");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		if (objectId != undefined) {
			r.addBody("objectid", objectId);
		}
		var callBackWrapper = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments : callBackArguments
		}
		this.getRequestResultAsync(r, OpenCore.DataManager, "getRecordsAsyncDone", callBackWrapper, background);
	},
	
	
	getRecordsAsyncDone : function(callBackWrapper){
		var callBackObject;
		var callBackFunction;
		var callBackArguments;
		var data;
		
		if(callBackWrapper.callBackObject != undefined){
			callBackObject = callBackWrapper.callBackObject;
		}
		
		if(callBackWrapper.callBackFunction != undefined){
			callBackFunction = callBackWrapper.callBackFunction;
		}
		
		if(callBackWrapper.callBackArguments != undefined){
			callBackArguments = callBackWrapper.callBackArguments;
		}
		
		if(callBackWrapper.data != undefined){
			data = callBackWrapper.data;
		}
		
		callBackArguments.data = data;
		
		if(callBackObject!= undefined){
			callBackObject[callBackFunction](callBackArguments);
		}
	},
	
	invokeMethodAsync: function(method, className, callBackObject, callBackFunction, callBackArguments){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "callmethod");
		r.addHeader("session_id", this.sessionId);
		r.addBody("method", method);
		r.addBody("classid", className);
		
		var callBackWrapper = {
			callBackObject : callBackObject,
			callBackFunction : callBackFunction,
			callBackArguments : callBackArguments
		}
		this.getRequestResultAsync(r, OpenCore.DataManager, "invokeMethodAsyncDone", callBackWrapper);
	},
	
	
	invokeMethodAsyncDone : function(callBackWrapper){
		var callBackObject;
		var callBackFunction;
		var callBackArguments;
		var data;
		
		if(callBackWrapper.callBackObject != undefined){
			callBackObject = callBackWrapper.callBackObject;
		}
		
		if(callBackWrapper.callBackFunction != undefined){
			callBackFunction = callBackWrapper.callBackFunction;
		}
		
		if(callBackWrapper.callBackArguments != undefined){
			callBackArguments = callBackWrapper.callBackArguments;
		}
		
		if(callBackWrapper.data != undefined){
			data = callBackWrapper.data;
		}
		
		callBackArguments.data = data;
		
		if(callBackObject!= undefined){
			callBackObject[callBackFunction](callBackArguments);
		}
		
		
	},
	
	
	
	getErrorId : function(){
		
		return this.errorId;
	},
	
	getErrorMessage : function(){
		return this.errorMessage;
		
	},
	
	getOpenCoreObjectByName: function(className){
		var r;
		if(this.openCoreObjects[className] != undefined){
			r = this.openCoreObjects[className];
		}
		return r;
	},
	
	deleteInstance : function(className, objectId){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "delete");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectId);
		var requestResult = this.getRequestResult(r);
		return requestResult;
	},
	
	getOpenCoreObjectsByMetaName : function(metaName){
		var r = [];
		for(var className in this.openCoreObjects){
			var openCoreObject = this.openCoreObjects[className];
			if(openCoreObject.classInfo!=undefined && 
				openCoreObject.classInfo["class"]!=undefined && 
				openCoreObject.classInfo["class"].metabase == metaName){
				r.push(openCoreObject);
			}
		}
		return r;
	}
};

