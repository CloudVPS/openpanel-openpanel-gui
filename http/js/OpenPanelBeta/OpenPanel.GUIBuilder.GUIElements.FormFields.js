OpenPanel.GUIBuilder.GUIElements.FormFields = function(){
	
	this.targetDiv = {};
	this.formObject = {};
	this.instance = undefined;
	this.fieldsDiv = {};
	this.openCoreObject = {};
	this.openCoreInstance = {};
	this.controller= {};
	this.fieldValues = {};
	this.callBackCommand = "";
	this.formPanel = {};
	this.ZIndex = 0;
}

OpenPanel.GUIBuilder.GUIElements.FormFields.prototype = {
		
	build : function(){
		if(this.targetDiv!=undefined){
			this.targetDiv.innerHTML = "";
			
			this.fieldsDiv = document.createElement("div");
			this.fieldsDiv.setAttribute("class", "fields");
			this.fieldsDiv.appendChild(document.createTextNode("fields: " + this.openCoreObject.name));
			this.targetDiv.appendChild(this.fieldsDiv);
			var formElement = document.createElement("form");
			formElement.setAttribute("id", this.openCoreObject.name + ":form");
			this.fieldsDiv.appendChild(formElement);
			this.createFields(this.instance);
		}
	},

	createItem : function(fieldName, obj){
		if(obj.type != undefined){
			var fieldType = obj.type;
			var item = {};
			switch(fieldType){
				
				case "password":
				case "integer":
				case "string":
					item = this.createTextField(fieldName, obj);
				break;
				
									
				case "enum":
					item = this.createEnum(fieldName, obj);
				break;
				
				case "bool":
					item = this.createBooleanField(fieldName, obj);
				break;
				
				case "group":
					item = this.createGroup(fieldName, obj);
				break;
				
				case "ref":
					item = this.createReference(fieldName, obj);
				break;
			}
			
			if(obj.group != undefined){
				item.disabled = true;
			}
			
			if(obj.required == true){
				item.allowBlank = false;
			}
			
			
			
			if(obj.regexp != undefined && obj.regexp!=""){
				//item.regex = new RegEx(obj.regexp);
			}
			
			return item;
		}
	},
	
	createGroup : function(fieldName, obj){
		// get grouped parameters
		var hook = this;
		var grouped = {};
		
		for(var paramName in this.openCoreObject.classInfo.structure.parameters){
			
			var parameter = this.openCoreObject.classInfo.structure.parameters[paramName];
			if(parameter.group != undefined){
				grouped[paramName] = parameter;
			}
		}
		
		var radios = [];
		
		for(var paramName in grouped){
			var radio = {
				value:1,
				boxLabel:paramName,
				listeners:{
					'check':function(r,c){
						console.log(r.boxLabel+": "+(c?"checked":"unchecked") + " " + this.boxLabel);
						console.log(hook.formPanel);
						
						var foundStuff = hook.formPanel.find("name", this.boxLabel);
						
						if (c == true) {
							for(var i = 0;i< foundStuff.length;i++){
								console.log("found to enable : " + i);
								console.log(foundStuff[i]);
								foundStuff[i].enable();
								foundStuff[i].setVisible(true);
							}
						} else {
							for(var i = 0;i< foundStuff.length;i++){
								console.log("found to disable : " + i);
								console.log(foundStuff[i]);
								foundStuff[i].disable();
								foundStuff[i].setVisible(true);
							}
						}
						
					}
				}
			}
			
			radios.push(radio);
		}
	
		var item = {xtype:'ux-radiogroup',
					fieldLabel:fieldName,
					name:fieldName,
					horizontal:false,
					radios:radios
			};
		
		return item;	
	},
	
	createBooleanField : function(fieldName, obj){
		var item = {
			xtype:'checkbox',
			fieldLabel: obj.description,
			name: fieldName,
			inputValue : "true"
		};
		
		return item;	
	},
	
	createNumberField : function(fieldName, obj){
		var item = {
			xtype:'numberfield',
			fieldLabel: obj.description,
			name: fieldName
		};
		
		return item;	
	},
	
	
	createEnum: function(fieldName, obj){
		var item = {};
		var enumItems = [];
		if(this.openCoreObject.classInfo.enums[fieldName] != undefined){
			
			var enums = this.openCoreObject.classInfo.enums[fieldName];
			for(var enumName in enums){
				var enumField = [
                  	
				   	enums[enumName].description + " " + enums[enumName].val,
					enums[enumName].val
               ];
				
				enumItems.push(enumField);
			}
		}
		
		var store = new Ext.data.SimpleStore({
		    fields: ['state', 'description'],
		    data : enumItems
			
		});
		var comboWithTooltip = new Ext.form.ComboBox({
		    store: store,
		    displayField: 'description',
			fieldLabel: obj.description,
		    typeAhead: true,
		    mode: 'local',
		    triggerAction: 'all',
		    emptyText:'Select ...',
		    selectOnFocus:true,
			name: fieldName,
			forceSelection: true
		});

			
		return comboWithTooltip;
	},
	
	createReference: function(fieldName, obj){
		var item = {};
		var referenceFields = [];
		//var refClass = obj.refClass;
		var references = this.formObject.controller.dataManager.getReferences(obj.refclass + "/" + obj.reflabel);
		console.log(references);
		if(references!=undefined){
			for(var referenceName in references){
				var referenceField = [
                  	referenceName,
				   	references[referenceName]
               ];
			   
			   referenceFields.push(referenceField);
			}
		}
		
		console.log("referenceFields");
		console.log(referenceFields);
		
		var store = new Ext.data.SimpleStore({
		    fields: ["description", "metaid"],
		    data : referenceFields
			
		});
		var comboWithTooltip = new Ext.form.ComboBox({
		    store: store,
		    displayField: 'description',
			fieldLabel: obj.description,
			valueField: 'metaid',
		    typeAhead: true,
		    mode: 'local',
		    triggerAction: 'all',
		    emptyText:'Select ...',
		    selectOnFocus:true,
			name: fieldName,
			forceSelection: true
		});

			
		return comboWithTooltip;
	},
	
	createTextField : function(fieldName, obj){
		var item = {
			xtype:'textfield',
			fieldLabel: obj.description,
			name: fieldName
		};
		
		return item;
	},
	
	createFields : function(instance){	
		if(instance == undefined){
			instance = {};
		}
		console.log("FormFields:createFields instance");
		console.log(instance);
		console.log("FormFields:createFields this.openCoreObject.name");
		console.log(this.openCoreObject.name);
		
		
		if(this.openCoreObject.classInfo.structure != undefined && this.openCoreObject.classInfo.structure.parameters != undefined){
			
			this.createFormPanel(instance);
			
			this.formPanel.render(this.fieldsDiv);
			if(this.openCoreObject.canUpdate == false){
				this.formPanel.disable();
			}
		} else {
			// no, is it a singleton?
			if(this.openCoreObject.singleton == true){
				// draw a delete button
			} else {
				// don't draw anything at all (this object can be deleted 
			}
		}
	},
	
	createFormPanel : function(instance){
		var parameters = this.openCoreObject.classInfo.structure.parameters;
		var items = [];
		var itemsLeft = [];
		var itemsRight = [];
		var a = 0;
		this.fieldValues = {};
		
		var hook = this;
		var items = {};
		for(var key in parameters){
			var parameter = parameters[key];
			var fieldName = key;
			var description = parameter.description;
			var fieldType = parameter.type;
			var item = this.createItem(key, parameter);
			
			if(instance[key]!=undefined){
				console.log("FormFields:instance [" + key + " " + instance[key] + "]");
				switch(parameter.type){
					case "bool":
						if(instance[key] == "true"){
							item.checked = true;
						} else {
							item.checked = false;
						}
					break;
					
					case "ref":
						var referenceObject = this.formObject.controller.dataManager.getOpenCoreObjectByName(parameter.refclass);
						if(referenceObject != undefined){
							var referenceInstances = referenceObject.getInstances();
							for(var metaid in referenceInstances){
								var referenceInstance = referenceInstances[metaid];
								if(referenceInstance.uuid == instance[key]){
									item.value = metaid;
								}
								console.log(referenceInstance.uuid + " " + instance[key]);
							}
						}
					break;
					
					case "group":
						// this should happen once the form is drawn. this pretty much sucks
						
						var radios = item.radios;
						
						
						for(var i=0;i<radios.length;i++){
							var radio = radios[i];
							if(typeof(radio) == "object"){
								console.log(items[radio.boxLabel]);
									
								if (this.instance[radio.boxLabel] != undefined) {
									radio.checked = true;
									items[radio.boxLabel].disabled = false;
								} else {
									items[radio.boxLabel].disabled = true;
								}
							}
						}
						console.log(this.instance);
					
					break;
					
					default:
						item.value = instance[key];
					
					
				}
				
				
			}
			if (this.ZIndex != 0) {
				item["z-index"] = this.ZIndex;
			}
			items[key] = item;
			if (a == 0) {
				itemsLeft.push(item);
				a++;
			}
			else {
				itemsRight.push(item);
				a = 0;
			}
		}
		
		if(itemsRight.length == 0){
			items = itemsLeft;
		} else {
			items = [{
	            layout:'column',
				
				
	            items:[{
	                columnWidth:.5,
	                layout: 'form',
	                items: itemsLeft
	            },{
	                columnWidth:.5,
	                layout: 'form',
	                items: itemsRight
	            }]
	        }]
			
		}
		
		var buttons = {};
		if (this.callBackCommand != "") {
			buttons = [{
				text: 'Save',
				handler: function(){
					hook.formPanel.submit();
				},
				formBind: true
			}]
		}
		
		this.formPanel = new Ext.FormPanel({
	        
	       
			/**/
			
			header: false,
			frame:false,
			hideBorders: true,
			autoScroll: true,
	        title: 'Simple Form',
	        bodyStyle:'padding:15px 15px 25px 15px;',
	        width: 650,
			
        	
	       /* defaults: {width: 640}, */
	       /*  baseCls: "", */
			onSubmit: function(arg){ console.log(arg); },
			submit: function() {
           		var obj = this.getForm().getValues();
				var objectId = hook.openCoreObject.singleton == true? hook.openCoreObject.classInfo["class"].singleton:obj.id;
				
				if(hook.callBackCommand != undefined){
					hook.formObject.controller.action(hook.callBackCommand, 
						{ 
							openCoreObject:hook.openCoreObject, 
							instance: instance, 
							formValues: hook.parseValues(this),
							optionalCallBackObject: hook.optionalCallBackObject
						});
				}
				
	        },
	        items: items,
			buttons: buttons
	    });
				
	},
	
	setZIndex : function(zIndex){
		this.ZIndex = zIndex;
	},
	
	getFormValues : function(){
		console.log("fields : " + this.openCoreObject.name);
		return this.parseValues(this.formPanel);
	},
	
	parseValues : function(form){
		// gets value from form and fills missing checkbox values (ext doesn't provide unchecked checkbox values)
		if (form != undefined && form.getForm != undefined) {
			var r = form.getForm().getValues();
			
			if (this.openCoreObject.classInfo.structure != undefined && this.openCoreObject.classInfo.structure.parameters != undefined) {
				var parameters = this.openCoreObject.classInfo.structure.parameters;
				
				for (var fieldName in parameters) {
					var field = parameters[fieldName];
					if (field.type == "bool") {
						if (r[fieldName] == undefined) {
							r[fieldName] = "false";
						}
					}
				}
			}
			return r;
		}
	},
	
	setInstance : function(instance){
		this.instance = instance;	
	},
	
	getInstance: function(){
		return this.instance;
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

