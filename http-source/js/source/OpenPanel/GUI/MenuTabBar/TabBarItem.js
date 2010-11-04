OpenPanel.GUI.MenuTabBar.TabBarItem = Class.create(OpenPanel.GUI.Menu.Item, {
	icon : "",
	iconDown : "",
	
	defaultIcon: "/images/logo_chrome.png",
	defaultIconDown: "/images/logo_firefox.png",
	
	initialize: function($super, name){
		$super(name);
		this.icon = this.defaultIcon;
		this.iconDown = this.defaultIconDown;
	},
	
	configure: function(configuration){
		if(configuration.icon && configuration.icon!=""){
			this.icon = configuration.icon;
			if(configuration.iconDown && configuration.iconDown!=""){
				this.iconDown = configuration.iconDown;
			} else {
				this.iconDown = this.icon;
			}
		}
		var iconImage = new Image(32,32);
		iconImage.src = this.icon;
		var iconDownImage = new Image(32,32);
		iconDownImage.src = this.iconDown;
		
		return this;
	},
	
	createBaseElement: function(name, down, active){
		var element = new Element("li").addClassName("OPIconBarItem");
		var table = new Element("table").writeAttribute("cellpadding", 0).writeAttribute("cellSpacing", 0);
		element.appendChild(table);

		var firstRow = new Element("tr");
		table.appendChild(firstRow);
		
		var left = new Element("td").addClassName("left");
		firstRow.appendChild(left);
		
		var center = new Element("td").writeAttribute("valign", "top").addClassName("center");
		firstRow.appendChild(center);
		
		var centerIcon = new Element("div").addClassName("icon");
		center.appendChild(centerIcon);
		var image = new Element("img").writeAttribute("src", this.icon);
		centerIcon.appendChild(image);
		
		var centerIconDown = new Element("div").addClassName("icon");
		center.appendChild(centerIconDown);
		var imageDown = new Element("img").writeAttribute("src", this.iconDown);
		centerIconDown.appendChild(imageDown);

		
		if(down){
			centerIcon.hide();
			centerIconDown.show();
		} else {
			centerIcon.show();
			centerIconDown.hide();
		}
		
		var centerDescription = new Element("div").addClassName("description").update(name);
		center.appendChild(centerDescription);
		
		var right = new Element("td").addClassName("right");
		
		firstRow.appendChild(right);
		return element;
	},
	
	createActiveElement: function(){
		var element = this.createBaseElement(this.name, false, true);
		element.addClassName("active");
		return element;
	},
	
	createActiveDownElement: function(){
		var element = this.createBaseElement(this.name, true, true);
		element.addClassName("active");
		return element;
	},
	createInactiveElement: function(){
		var element = this.createBaseElement(this.name);
		return element;
	},
	
	createInactiveDownElement: function(){
		var element = this.createBaseElement(this.name, true);
		return element;
	}
});