OpenPanel.GUI.Menu = Class.create({
	
	items : new Array(),
	menuElement : null,
	activeItem: null,
	isBuilt: false,
	container : null,
	targetElement : null,
	
	initialize: function(name, targetElement) {
		if(!name){
			throw new Error("Menu missing name");
		}
		this.name = name;
		this.isBuilt = false;
		this.items = new Array();
		if(!targetElement){
			throw new Error("Menu missing target element");
		}
		this.targetElement = targetElement;
		this.menuElement = new Element("div");
	},
	
	getContainerId: function(){
		return "OP:Menu:" + this.name;
	},
	
	build: function(){
		if(this.targetElement){
			if(this.targetElement){
				this.createContainer();
				this.targetElement.appendChild(this.container);
			}
			var menuElement = this.createMenuElement();
			this.container.appendChild(menuElement);
			var me = this;
			this.items.each(function(item, index) {
				var element = item.createElement();
				menuElement.appendChild(element);
			});
			this.isBuilt = true;
		}
	},
	
	click: function(item){
		item.click();
	},
	
	select: function(item){
		if(this.isBuilt){
			if(this.activeItem != item){
				
				if(this.activeItem){
					this.activeItem.deactivate();
				}
				
				item.activate();
				this.activeItem = item;
			}
		} else {
			if(this.activeItem){
				this.activeItem.deactivate();
			}
			this.activeItem = item;
			item.activate();
		}
	},
	
	createMenuElement: function(){
		if(this.menuElement && this.menuElement.parentNode){
			this.menuElement.remove();
		}
		this.menuElement = new Element("div");
		
		
		return this.menuElement;
	},
	
	addItem: function(item){
		if(item.isClickable){
			var index = this.items.indexOf(item);
			if(index!==-1){
				throw new Error("item is already in menu");
			}
		}
		this.items.push(item);
		item.setMenu(this);
		
		if(this.isBuilt == true){
			this.build();
		}
	},
	
	deleteItem: function(itemObject){
		this.items = this.items.without(itemObject);
		
		if(this.isBuilt == true){
			this.build();
		}
	},
	
	createContainer : function(){
		var containerId = this.getContainerId();
		var container = new Element("div").writeAttribute("id", containerId);
		
		if(this.container){
			this.container.replace(container);
		}
		
		this.container = container;
	},
	
	getContainerId: function(){
		return "OP:GUI:" + this.name;
	},
	
	report: function(){
		console.log(this);
	}
});