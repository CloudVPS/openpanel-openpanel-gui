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
	
	getInstancesAsync: function(){
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
	
	getInstancesAsyncDone : function(){
		
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
	},
	
	getChildCount: function(){
		return this.childCount;
	}
	
	
}
