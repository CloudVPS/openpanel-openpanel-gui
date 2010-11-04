OpenPanel.GUI.Menu.SpacerItem = Class.create(OpenPanel.GUI.Menu.BaseItem, {
	initialize: function($super){
		$super();
	},
	
	createElement : function(clicked){
		this.element = new Element("div").update("|");
		return this.element;
	}
});