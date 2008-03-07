OpenPanel.GUIBuilder.GUIElements.FormGrid = function(){
	
	this.targetDiv = {};
	this.formObject = {};
	this.instances = {};
	this.openCoreObject = {};
	this.openCoreInstance = {};
	this.controller= {};
	this.callBackCommand = "";
	
	
}

OpenPanel.GUIBuilder.GUIElements.FormGrid.prototype = {
		
	build : function(){
		console.log("grid : " + this.openCoreObject.name);
		
		if(this.targetDiv!=undefined){
			this.targetDiv.innerHTML = "";
			
			this.gridDiv = document.createElement("div");
			this.gridDiv.setAttribute("class", "grid");
			this.gridDiv.appendChild(document.createTextNode("grid: " + this.openCoreObject.name));
			this.targetDiv.appendChild(this.gridDiv);
			if (this.openCoreObject.meta == true) {
				this.createMetaGrid(this.instances);
			} else {
				this.createGrid(this.instances);
			}
		}
	},
	
	createMetaGrid : function(instances){
		// create headers
		
		// create data
		var hook = this;
		var storeData = new Array();
		var instanceKeys = new Array();
		
		for(var key in instances){
			var instance = instances[key];
			if(typeof(instance) == "object"){
				var className = instance["class"];
				var classInfo = this.formObject.controller.dataManager.getClassInfo(this.openCoreObject.name);
				var params = classInfo.structure.parameters;
				var storeDataEntry = new Array();
				
				for(var paramKey in params){
					var param = params[paramKey];
					storeDataEntry.push(instance[paramKey]);
				}
				
				storeData.push(storeDataEntry);
			}
		}
		
		
		var fields = [];
		var columns = new Array();
		var className = this.openCoreObject.name;
		var classInfo = this.formObject.controller.dataManager.getClassInfo(className);
		var params = classInfo.structure.parameters;
		
		for(var paramName in params){
			var param = params[paramName];
			fields.push({name : paramName});
			
			var obj = {
				id: paramName,
				header: paramName,
				sortable : true
			};
			
			if(param.visible == "false"){
		 		obj.visible = false;
			} else {
				
			}
			columns.push(obj);
		}
	
		var store = new Ext.data.SimpleStore({
	        fields: fields
	    });
		console.log("stuff", fields, columns);
		store.loadData(storeData);
	
		this.grid = new Ext.grid.GridPanel({
	        store: store,
	        columns: columns, /*,*/
	        stripeRows: false,
	        autoExpandColumn: 'id',
	        height:150,
	        width:575,
	        title: this.openCoreObject.title,
			header: false
		});
		
   	 	this.grid.render(this.targetDiv);
		
		var hook = this;
		this.grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
	        hook.cellClick(hook.grid, rowIndex, columnIndex, e);
		});
		
		
		var tableElement = document.createElement("table");
		this.gridDiv.appendChild(tableElement);
		
		var headers;
		for(var id in instances){
			var instance = instances[id];
			if(headers == undefined){
				headers = true;
				var headerTBodyElement = document.createElement("tbody");
				var headerTrElement = document.createElement("tr");
				tableElement.appendChild(headerTBodyElement);
				headerTBodyElement.appendChild(headerTrElement);
				var className = instance["class"] != undefined ? instance["class"]: undefined;
				if(className != undefined){
					var openCoreObject = this.openCoreObject;
					if(openCoreObject.classInfo.structure != undefined && openCoreObject.classInfo.structure.parameters != undefined){
						var parameters = openCoreObject.classInfo.structure.parameters;
						for(var paramName in parameters){
							var param = parameters[paramName];
							var headerTdElement = document.createElement("td");
							headerTrElement.appendChild(headerTdElement);
							headerTdElement.appendChild(document.createTextNode(param.description));
						}
					} else {
						alert("class " + openCoreObject.name + " has no classinfo.structure");
					}
				}
			}
			
			if(parameters != undefined){
				var tBodyElement = document.createElement("tbody");
				var trElement = document.createElement("tr");
				tableElement.appendChild(tBodyElement);
				tBodyElement.appendChild(trElement);
				
				for(var paramName in parameters){
					var param = parameters[paramName];
					var tdElement = document.createElement("td");
					tdElement.setAttribute("id", id);
					trElement.appendChild(tdElement);
					tdElement.appendChild(document.createTextNode(instance[paramName]));
					tdElement.onclick = function(){
						hook.clickGridItem(this.id);
					}
				}
			}
		}
	},
	
	createGrid : function(instances){
		// create the data store
			
		var storeData = new Array();
		var instanceKeys = new Array();
		
		for(var key in instances){
			var instance = instances[key];
			if(typeof(instance) == "object"){
				var className = instance["class"];
				var classInfo = this.formObject.controller.dataManager.getClassInfo(className);
				var params = classInfo.structure.parameters;
				var storeDataEntry = new Array();
				
				for(var paramKey in params){
					var param = params[paramKey];
					storeDataEntry.push(instance[paramKey]);
				}
				
				storeData.push(storeDataEntry);
			}
		}
		
		
		var fields = [];
		var columns = new Array();
		var className = this.openCoreObject.name;
		var classInfo = this.formObject.controller.dataManager.getClassInfo(className);
		var params = classInfo.structure.parameters;
		
		for(var paramName in params){
			var param = params[paramName];
			fields.push({name : paramName});
			
			var obj = {
				id: paramName,
				header: paramName,
				sortable : true
			};
			
			if(param.visible == "false"){
		 		obj.visible = false;
			} else {
				
			}
			columns.push(obj);
		}
	
		var store = new Ext.data.SimpleStore({
	        fields: fields
	    });
		console.log("stuff", fields, columns);
		store.loadData(storeData);
	
		this.grid = new Ext.grid.GridPanel({
	        store: store,
	        columns: columns, /*,*/
	        stripeRows: false,
	        autoExpandColumn: 'id',
	        height:150,
	        width:575,
	        title: this.openCoreObject.title,
			header: false
		});
		
   	 	this.grid.render(this.targetDiv);
		
		var hook = this;
		this.grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
	        hook.cellClick(hook.grid, rowIndex, columnIndex, e);
		});
		
		/*
		var hook = this;
		
		var tableElement = document.createElement("table");
		this.gridDiv.appendChild(tableElement);
		
		var headers;
		for(var id in instances){
			var instance = instances[id];
			if(headers == undefined){
				headers = true;
				var headerTBodyElement = document.createElement("tbody");
				var headerTrElement = document.createElement("tr");
				tableElement.appendChild(headerTBodyElement);
				headerTBodyElement.appendChild(headerTrElement);
				var className = instance["class"] != undefined ? instance["class"]: undefined;
				if(className != undefined){
					var openCoreObject = OpenCore.DataManager.getOpenCoreObjectByName(className);
					
					if(openCoreObject.classInfo.structure != undefined && openCoreObject.classInfo.structure.parameters != undefined){
						var parameters = openCoreObject.classInfo.structure.parameters;
						for(var paramName in parameters){
							var param = parameters[paramName];
							var headerTdElement = document.createElement("td");
							headerTrElement.appendChild(headerTdElement);
							headerTdElement.appendChild(document.createTextNode(param.description));
						}
					} else {
						alert("class " + openCoreObject.name + " has no classinfo.structure");
					}
				}
			}
			
			if(parameters != undefined){
				var tBodyElement = document.createElement("tbody");
				var trElement = document.createElement("tr");
				tableElement.appendChild(tBodyElement);
				tBodyElement.appendChild(trElement);
				
				for(var paramName in parameters){
					var param = parameters[paramName];
					var tdElement = document.createElement("td");
					tdElement.setAttribute("id", id);
					trElement.appendChild(tdElement);
					tdElement.appendChild(document.createTextNode(instance[paramName]));
					tdElement.onclick = function(){
						hook.clickGridItem(this.id);
					}
				}
			}
		}
		*/
	},
	
	cellClick : function(grid, rowIndex, columnIndex, e) {
		/*
		[undefined, 0, 0, Object browserEvent=Event click button=0 type=click]
		Object id=1003 data=Object json=[3] store=Object fields=[3], undefined, undefined
		 */
		console.log(arguments);
        var record = this.grid.getStore().getAt(rowIndex);  // Get the Record
        var fieldName = this.grid.getColumnModel().getDataIndex(columnIndex); // Get field name
        var id = record.get("id");
		console.log(record, fieldName, id);
		this.clickGridItem(id);
	},
	
	clickGridItem : function(id){
		console.log(id);
		this.formObject.clickGridItem(this.instances[id]);
	},
	
	setInstances : function(instances){
		this.instances = instances;	
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setOpenCoreInstance: function(openCoreInstance){
		this.openCoreInstance = openCoreInstance;
	},
	
	setTargetDivName : function(targetDivName){
		var targetDiv = document.getElementById(targetDivName);
		this.setTargetDiv(targetDiv);
	},
	
	setTargetDiv: function(targetDiv){
		if(targetDiv != undefined){
			this.targetDiv = targetDiv;
		} else {
			alert("div does not exist "+ targetDivName);
		}
	},
	
	setFormObject: function(formObject){
		this.formObject = formObject;
	},
	
	setController : function(controller){
		this.controller = controller;
	},
	
	setCallBackCommand : function(callBackCommand, optionalCallBackObject){
		this.callBackCommand = callBackCommand;
		this.optionalCallBackObject = optionalCallBackObject;
	}
	
}

