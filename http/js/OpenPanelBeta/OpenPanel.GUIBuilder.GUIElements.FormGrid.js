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
		console.log("createMetaGrid");
		console.log(instances);
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
			
		var f;
		var storeData = new Array();
		var instanceKeys = new Array();
		var firstPass = true;
		
		for(var key in instances){
			var instance = instances[key];
			if(typeof(instance) == "object"){
				
				var storeDataEntry = new Array();
				for(var instanceKey in instance){
					if(firstPass == true){
						instanceKeys.push(instanceKey);
					}
				}
				firstPass = false;
				storeDataEntry.push(key);
				
				storeData.push(storeDataEntry);
				
			}
		}
		var fields = [];
		var columns = [];
		
		for(var i = 0;i<instanceKeys.length;i++){
			var obj = new Object();
			obj.name = instanceKeys[i];
			fields.push({name : instanceKeys[i]});
			columns.push({id : instanceKeys[i], header: instanceKeys[i], dataIndex: instanceKeys[i], sortable: true});
		}
		
	    var store = new Ext.data.SimpleStore({
	        fields:  fields
	    });
    	store.loadData(storeData);
		
		this.grid = new Ext.grid.GridPanel({
	        store: store,
	        columns: columns,
			/*[
	            {id:'uuid',header: "Uuid"},
	            {header: "id", width: 190, sortable: true, dataIndex: 'id', hideable:false},
	            {header: "className", width: 0, sortable: true, dataIndex: 'className', hidden: false, hideable:false}
			],*/
	        stripeRows: false,
	        autoExpandColumn: 'uuid',
	        height:150,
	        width:575,
	        title:'Array Grid',
			header: false
			
	    });
		
   	 	this.grid.render(this.targetDiv);
		
		
		console.log(instances);
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

