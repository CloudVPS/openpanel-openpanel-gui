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

OpenCore.DataManager.OpenCoreObject = function(parent, name){
	this.uuid = "";
	this.parent;
	this.name = "";
	this.children = [];
	this.classInfo = undefined;
	this.instances = {};
	this.fetchedInstances = false;
	
	this.currentInstance = {};
	this.description = "";
	this.openCoreObjects = {};
	this.singleton = false;
	this.singletonValue = "";
	this.indexing = "";
	this.meta = false;
	this.metaValue = "";
	
	this.canDelete = false;
	this.canCreate = false;
	this.canUpdate = false;
	this.canGetInfo = false;
	
	this.isRootObject = false;
	this.title = "";
	this.childCount = 0;
	this.init(parent, name);
	if(name == "ROOT"){
		OpenCore.DataManager.rootObject = this;
	}
}

OpenCore.DataManager.OpenCoreObject.prototype = {
	
	init : function(parent, name){
		this.parent = parent;
		this.name = name;
		if(OpenCore.DataManager.OpenCoreObject.openCoreObjects == undefined){
			OpenCore.DataManager.OpenCoreObject.openCoreObjects = {};
			OpenCore.DataManager.openCoreObjects = OpenCore.DataManager.OpenCoreObject.openCoreObjects;
		}
		OpenCore.DataManager.OpenCoreObject.openCoreObjects[name] = this;
		this.getClassInfo();
		if(name != "ROOT"){
			this.description = this.classInfo["class"].description;
			if(this.classInfo["class"].singleton !=""){
				this.singleton = true;
				this.singletonValue = this.classInfo["class"].singleton;
			}
			
			this.indexing = this.classInfo["class"].indexing;
			this.metaType = this.classInfo["class"].metatype;
			
			this.meta = this.metaType == "base"?true:false;
			this.title = this.classInfo["class"].title;
			if (this.classInfo.capabilities != undefined) {
				// this should throw an exception
				this.canDelete = this.classInfo.capabilities["delete"];
				this.canCreate = this.classInfo.capabilities.create;
				this.canUpdate = this.classInfo.capabilities.update;
				this.canGetInfo = this.classInfo.capabilities.getInfo;
			}
			
			this.uuid = this.classInfo["class"].uuid;
			
			if(this.classInfo.info!= undefined && this.classInfo.info.parent == undefined){
				this.isRootObject = true;
			}
		}
	},
	
	getObjectByName:function(name){
		if(OpenCore.DataManager.OpenCoreObject.openCoreObjects[name]!=undefined){
			return OpenCore.DataManager.OpenCoreObject.openCoreObjects[name];
		}	
	},
	
	getClassInfo: function(){
		if (this.classInfo == undefined) {
			this.classInfo = OpenCore.DataManager.getClassInfo(this.name);
		}
		
		return this.classInfo;
	},
	
	getChildren: function(){
		this.getClassInfo();
		this.children = [];
		if(this.classInfo.info != undefined && this.classInfo.info.children!=undefined){
			var childrenInfo = this.classInfo.info.children;
			
			for(var key in childrenInfo){
				this.childCount++;
				var childInfo = childrenInfo[key];
				var childClassName = childInfo.id;
				var childClass = new OpenCore.DataManager.OpenCoreObject(this, childClassName);
				this.children.push(childClass);
				childClass.getChildren();
			}
		}
	},
	
	getCurrentInstance: function(uuid){
		// keeper?
		this.currentInstance = OpenCore.DataManager.getRecordByUUID(this.name, uuid);
		if (this.currentInstance != undefined) {
			return this.currentInstance;
		}
	},
	
	setHasFetchedInstances : function(state){
		this.fetchedInstances = state;
	},
	getInstances: function(){
		if(this.fetchedInstances == false){
			this.instances = {};
			this.fetchedInstances = true;
			var r = OpenCore.DataManager.getRecords(this.name);
			if(r != undefined ){
				this.instances = r[this.name];
			}
		}
		return this.instances;
	},
	
	getInstancesByParentUUID: function(uuid){
		if(this.fetchedInstances == false){
			this.instances = {};
			this.fetchedInstances = true;
			console.log("getInstancesByParentUUID " + uuid + " " + this.name);
			var r = OpenCore.DataManager.getInstancesByParentUUID(this.name, uuid);
			if(r!=undefined){
				this.instances = r[this.name];
				console.log(this.instances);
			}
		}
		return this.instances;
	},
	
	getInstanceByUUID: function(uuid){
		this.getInstances();
		for(var key in this.getInstances()){
			if(this.instances[key].uuid == uuid){
				return this.instances[key];
			}
		}
		
		//return {};
	},
	
	getFirstInstance: function(){
		this.getInstances();
		for (var key in this.instances) {
			return this.instances[key];
		}
		
		//return {};	
	},
	
	getOffSpring: function(){
		this.getChildren();
		for(var key in this.children){
			var child = this.children[key];
			if (typeof(child) == "object") {
				child.getOffSpring();
			}
		}
	}
}
