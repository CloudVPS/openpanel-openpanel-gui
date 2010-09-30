OpenPanel.GUI.Menu.BaseItem = Class.create({
	element: null,
	menu : null,
	isClickable: false,
	
	initialize: function(){
		this.menu = null;
	},
	
	click: function(){
		
	},
	
	setMenu: function(menu) {
		if(!menu instanceof OpenPanel.GUI.Menu){
			throw new Error("menu argument is not a Menu");
		}
		if(this.menu != null && this.menu!=menu){
			this.menu.deleteItem(this);
		}
		this.menu = menu;
	},
	
	createElement : function(){
		this.element = new Element("div").update("[item]");
		return this.element;
	}
});

