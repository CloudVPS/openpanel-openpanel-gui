OpenPanel.GUIBuilder.Widget = {
	widgets : new Object(),
	createWidget : function(parameter){
		if (parameter.label != undefined) {
			if (parameter.type != undefined) {
				if (OpenPanel.GUIBuilder.Widget[parameter.type] != undefined) {
					var b = new OpenPanel.GUIBuilder.Widget.Base();
					var t = new OpenPanel.GUIBuilder.Widget[parameter.type]();
					OpenPanel.GUIBuilder.Widget.extend(b, t);
					OpenPanel.GUIBuilder.Widget.widgets[parameter.name] = t;
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
	}
	
}
