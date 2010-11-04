OpenPanel.GUI.MenuTabBar = Class.create(OpenPanel.GUI.Menu, {
	createMenuElement: function($super){
		var menuElement = $super();
		var someNewElement = new Element("ul");
		menuElement.appendChild(someNewElement);
		return someNewElement;
	}
});

