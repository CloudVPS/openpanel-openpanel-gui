OpenPanel.GUI.MenuIconBar.IconBarSpacerItem = Class.create(OpenPanel.GUI.Menu.BaseItem, {
	initialize: function($super){
		$super();
	},
	
	createElement : function(clicked){
		this.element = new Element("li").addClassName("OPIconBarSpacerItem").update("&nbsp;");
		return this.element;
	}
});