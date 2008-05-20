OpenPanel.GUIBuilder.Widget = {
	widgets : new Object(),
	groups : {},
	
	createWidget : function(parameter){
		if (parameter.label != undefined) {
			if (parameter.type != undefined) {
				if (OpenPanel.GUIBuilder.Widget[parameter.type] != undefined) {
					var b = new OpenPanel.GUIBuilder.Widget.Base();
					var t = new OpenPanel.GUIBuilder.Widget[parameter.type]();
					OpenPanel.GUIBuilder.Widget.extend(b, t);
					OpenPanel.GUIBuilder.Widget.widgets[parameter.name] = t;
					if (parameter.group != undefined) {
						t.isGrouped = true;
						t.groupName = parameter.group;
						if(this.groups[parameter.group] == undefined) {
							this.groups[parameter.group] = new Array();
						}
						this.groups[parameter.group].push(t);
					}
					
					t.parameter = parameter;
					if(parameter.needed != undefined && (parameter.needed == true || parameter.needed == false)){
						t.setNeeded(parameter.needed);
					}
					
					return t;
				}
				else {
					throw new Error("Missing or incorrect type: '" + parameter.name + "' does not exist");
				}
			} else {
				throw new Error("Missing parameter type");
			}
		} else {
			throw new Error("Missing parameter name");
		}
	},
	
	extend : function(superObject, subObject){
		var obj = new Object();
		OpenPanel.GUIBuilder.Widget.override(superObject, obj);
		OpenPanel.GUIBuilder.Widget.override(subObject, obj);
		OpenPanel.GUIBuilder.Widget.override(obj, subObject);
		subObject.$super = superObject;
	},
	
	override : function(source, target){
		for(var key in source){
			target[key] = source[key];
		}
	},
	
	registerWidget : function(widget){
		this.widgets.push(widget);
	},
	
	getValues : function(){
		var result = new Object();
		for(var paramName in OpenPanel.GUIBuilder.Widget.widgets){
			var widget = OpenPanel.GUIBuilder.Widget.widgets[paramName];
			result[paramName] = widget.getValue();
		}
		return result;
	},
	
	validateGroupValues : function(){
		
		for(var groupName in OpenPanel.GUIBuilder.Widget.groups){
			var noValue = true;
			var group = OpenPanel.GUIBuilder.Widget.groups[groupName];
			for(var i = 0;i<group.length;i++){
				var groupWidget = group[i];
				var value = groupWidget.getValue();
				if (value != undefined) {
					groupWidget.enableGroup();
					groupWidget.enable();
					if (noValue == true) {
						noValue = false;
					} else {
						throw new Error("Value problem, only one value should be set.");
					}
				} else {
					groupWidget.disableGroup();
					groupWidget.disable();
					
				}
			}
		}
	},
	
	onChange : function(widget){
		
	},
	
	onFocus : function(widget) {
			
		if(widget.isGrouped != undefined && widget.isGrouped == true){
			var group = OpenPanel.GUIBuilder.Widget.groups[widget.groupName];
			for (var i = 0; i < group.length; i++) {
				var groupWidget = group[i];
			
				if(widget === groupWidget){
					groupWidget.enable();
				} else {
					groupWidget.disable();
				}
			}
		}
	},
	
	setChanged : function(widget){
		if(widget.isGrouped != undefined && widget.isGrouped == true){
			var group = OpenPanel.GUIBuilder.Widget.groups[widget.groupName];
			for (var i = 0; i < group.length; i++) {
				var groupWidget = group[i];
				if(widget != groupWidget){
					groupWidget.setValue();
				}
			}
		}
	}
}
