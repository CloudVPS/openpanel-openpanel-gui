OpenPanel.GUIBuilder.GUIElements.FormGrid = function(){
	
	this.targetDiv = {};
	this.formObject = {};
	this.instances = {};
	this.openCoreObject = {};
	this.instance = {};
	this.controller= {};
	this.callBackCommand = "";
	this.store = {};
	this.gridWidth = 610;
}

OpenPanel.GUIBuilder.GUIElements.FormGrid.prototype = {
		
	build : function(){
		if(this.targetDiv!=undefined){
			this.targetDiv.innerHTML = "";
			
			this.gridDiv = document.createElement("div");
			this.gridDiv.setAttribute("class", "grid");
			this.targetDiv.appendChild(this.gridDiv);
			if (this.openCoreObject.meta == true) {
				this.createMetaGrid(this.instances);
			} else {
				this.createGrid(this.instances);
			}
			this.grid.render(this.targetDiv);
			
			// select current item
			if(this.instance.uuid != undefined){
				var uuid = this.instance.uuid;
				var record = this.store.getAt(this.store.find("uuid", uuid));
				this.grid.getSelectionModel().selectRecords([record]);
				console.log("record", record);
			}
			
			var hook = this;
			this.grid.on("cellclick", function(grid, rowIndex, columnIndex, e) {
		        hook.cellClick(hook.grid, rowIndex, columnIndex, e);
			});
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
				storeDataEntry.push(instance.uuid);
				for(var paramKey in params){
					var param = params[paramKey];
					if (param.gridhide == undefined) {
						storeDataEntry.push(instance[paramKey]);
					}
				}
				
				storeData.push(storeDataEntry);
			}
		}
		
		
		var fields = [{name : "uuid"}];
		var obj = {
			id: "uuid",
			header: "uuid",
			sortable : true,
			hidden : true
		};
			
		var columns = new Array();
		columns.push(obj);
		
		var className = this.openCoreObject.name;
		var classInfo = this.formObject.controller.dataManager.getClassInfo(className);
		var params = classInfo.structure.parameters;
		
		for(var paramName in params){
			var param = params[paramName];
			if (param.gridhide == undefined) {
				fields.push({
					name: paramName
				});
				
				var obj = {
					id: paramName,
					header: paramName,
					sortable: true
				};
				
				if (param.visible == false || paramName == "uuid") {
					obj.hidden = true;
				}
				
				if (param.gridwidth != undefined) {
					obj.width = (this.gridWidth - 10) * param.gridwidth / 100;
				}
				columns.push(obj);
			}
		}
	
		this.store = new Ext.data.SimpleStore({
	        fields: fields
	    });
		this.store.loadData(storeData);
	
		this.grid = new Ext.grid.GridPanel({
	        store: this.store,
	        columns: columns, /*,*/
	        stripeRows: false,
	        autoExpandColumn: 'id',
	        height:150,
	        width: this.gridWidth,
	        title: this.openCoreObject.title,
			header: false,
			sm : new Ext.grid.RowSelectionModel({singleSelect:true})
		});
		
   	 	
		
		
		/*
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
		*/
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
				var storeDataEntry = [instance.uuid];
				
				for(var paramKey in params){
					var param = params[paramKey];
					if(param.gridhide == undefined){
						storeDataEntry.push(instance[paramKey]);
					}
					
				}
				
				storeData.push(storeDataEntry);
			}
		}
		
		
		var fields = [{name: "uuid"}];
		
		
		var columns = [{
			id: "uuid",
			header: "uuid",
			sortable : true,
			hidden : true
		}];
		var className = this.openCoreObject.name;
		var classInfo = this.formObject.controller.dataManager.getClassInfo(className);
		var params = classInfo.structure.parameters;
		
		for(var paramName in params){
			var param = params[paramName];
			if (param.gridhide == undefined) {
				fields.push({
					name: paramName
				});
				
				var obj = {
					id: paramName,
					header: paramName,
					sortable: true
				};
				
				if (param.visible == false) {
					obj.hidden = true;
				}
				
				if(param.gridwidth != undefined){
					obj.width = (this.gridWidth - 10)* param.gridwidth/100;
					
				}
			
				columns.push(obj);
			}
		}
		
		this.store = new Ext.data.SimpleStore({
	        fields: fields
	    });
		this.store.loadData(storeData);
		
		this.grid = new Ext.grid.GridPanel({
	        store: this.store,
	        columns: columns, /*,*/
	        stripeRows: false,
	        autoExpandColumn: fields[0].name,
	        height:150,
	        width: this.gridWidth,
	        title: this.openCoreObject.title,
			header: false
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
		var record = this.store.getAt(rowIndex);
		var fieldName = this.grid.getColumnModel().getDataIndex(columnIndex); // Get field name
        var id = record.get("id");
		if(id == undefined){
			id = record.get("uuid");
		}
		this.clickGridItem(id);
	},
	
	clickGridItem : function(id){
		console.log("clickGridItem", id, this.instances);
		this.formObject.clickGridItem(this.instances[id]);
	},
	
	setInstances : function(instances){
		this.instances = instances;	
	},
	
	setOpenCoreObject : function(openCoreObject){
		this.openCoreObject = openCoreObject;	
	},
	
	setInstance: function(instance){
		this.instance = instance;
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

