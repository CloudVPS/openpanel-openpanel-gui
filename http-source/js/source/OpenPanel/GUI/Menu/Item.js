OpenPanel.GUI.Menu.Item = Class.create(OpenPanel.GUI.Menu.BaseItem, {
	name : "",
	observers : {},
	isClickable: true,
	isActive: false,
	
	initialize: function($super, name){
		$super();
		
		this.observers = {};
		
		if(!name || name == ""){
			throw new Error("name not defined or name is empty");
		}
		
		this.setName(name);
	},
	
	activate: function(){
		this.isActive = true;
		this.createElement();
	},
	
	deactivate: function(){
		this.isActive = false;
		this.createElement();
	},
	
	createActiveElement: function(){
		return new Element("div").update("active");
	},
	
	createActiveDownElement: function(){
		return new Element("div").update("active down");
	
	},
	
	createInactiveElement: function(){
		return new Element("div").update("inactive");
	},
	
	createInactiveDownElement: function(){
		return new Element("div").update("inactive down");
	},
	
	createElement : function(isDown) {
		var element;
		var that = this;
		var boundMouseUpHandler;
		if(this.isActive == true){
			if(!isDown){
				element = this.createActiveElement();
			} else {
				element = this.createActiveDownElement();
			}
			
		} else {
			if(!isDown){
				element = this.createInactiveElement();
			} else {
				element = this.createInactiveDownElement();
			}
			
			Element.observe(element, "mouseup", function(event){
				that.menu.select(that);
				Element.stopObserving(element, "mouseup", boundMouseUpHandler);
			});
		}
		
		boundMouseUpHandler = this.mouseout.bind(this);
		
		if(isDown){
			Element.observe(element, "mouseout", this.mouseout.bind(this));
		} else {
			Element.observe(element, "mousedown", this.mousedown.bind(this));
		}
		Element.observe(element, "mouseup", boundMouseUpHandler);
		
		// add handlers
		var that = this;
		if(this.isActive!==true) {
			Object.keys(this.observers).each(function(eventName){
				var handlerArray = that.observers[eventName];
				if(handlerArray){
					handlerArray.each(function(handler){
						element.observe(eventName, handler);
					});
				}
			});
		}
		
		if(this.element && this.element.parentNode){
			this.element.replace(element);	
		}
		
		this.element = element;
		
		return this.element;
	},
	
	mousedown: function(event){
		this.createElement(true);
	},
	
	mouseout: function(event){
		this.createElement();
	},
		
	observe: function(eventName, handler){
		if(!this.observers[eventName]){
			this.observers[eventName] = new Array();
		}
		this.observers[eventName].push(handler);
		
		return this;
	},
	
	simulate: function(eventName){
		if(this.element){
			Element.simulate(this.element, eventName);
		}
		return this;
	},
	
	click: function(){
		if(this.element){
			this.element.simulate("mouseup");
		}
	},
	
	select: function(){
		if(this.menu){
			this.menu.select(this);
		}
		return this;
	},
	
	setName : function(name){
		this.name = name;
		return this;
	}
});