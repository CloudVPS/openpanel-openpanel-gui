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
	
	initializeQuotaObject : function(){
		new OpenCore.DataManager.OpenCoreObject("ROOT", "User");
		this.quotaObject =  new OpenCore.DataManager.OpenCoreObject("User", "OpenCORE:Quota")
		this.quotaObject.getInstances();
		for(var metaid in this.quotaObject.instances){
			this.quotaByClassName[this.quotaObject.instances[metaid].metaid] = this.quotaObject.instances[metaid];		
		}
	},
	
	checkQuotum : function(className){
		console.log("quota " + className);
		console.log(className);
		var quotum = this.quotaByClassName[className];
		if(quotum!=undefined){
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
	
	getClassInfo: function(className){
		
		if(this.classInfos == undefined){
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
	
	getRecordsAsync : function(className, callback){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecords");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		this.getRequestResultAsync(r, callback);
	},
	
	getRecord : function(className, objectid){
		var r = new this.rpc.SendVars();
		r.addHeader("command", "getrecord");
		r.addHeader("session_id", this.sessionId);
		r.addBody("classid", className);
		r.addBody("objectid", objectid);
		console.log(r);
		var requestResult = this.getRequestResult(r);
		if (requestResult.body != undefined 
		&& requestResult.body.data != undefined 
		&& requestResult.body.data.object != undefined) {
			return requestResult.body.data.object;
		}
		
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
		try {
			var r = jQuery.parseJSON(this.rpc.RequestHandler.synchronizedRequest(sendVars));
			
			if(r.header != undefined && r.header.errorid != undefined && r.header.error !=undefined){
				this.errorId = r.header.errorid;
				this.errorMessage = r.header.error;
				return r;
			}
		} catch (e){
			this.errorId = "666";
			this.errorMessage = "Could not parse server response. Response is not JSON?";
		}
	},
	
	getRequestResultAsync: function(sendVars){
		try {
			var r = jQuery.parseJSON(this.rpc.RequestHandler.asynchronizedRequest(sendVars));
			
			if(r.header != undefined && r.header.errorid != undefined && r.header.error !=undefined){
				this.errorId = r.header.errorid;
				this.errorMessage = r.header.error;
				return r;
			}
		} catch (e){
			this.errorId = "666";
			this.errorMessage = "Could not parse server response. Response is not JSON?";
		}
	},
	
	/*if (requestResult.body != undefined 
		&& requestResult.body.data != undefined 
		&& requestResult.body.data[className] != undefined) {
			return requestResult.body.data;
		}*/
	
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
			console.log(className);
			if(openCoreObject.classInfo!=undefined && 
				openCoreObject.classInfo["class"]!=undefined && 
				openCoreObject.classInfo["class"].metabase == metaName){
				r.push(openCoreObject);
			}
		}
		return r;
	}
};

