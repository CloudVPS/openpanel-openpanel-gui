OpenPanel.GUI.MenuIconBar = Class.create(OpenPanel.GUI.Menu, {
	initialize: function($super, name, targetElement){
		$super(name, targetElement);
	},
	
	build: function($super){
		if(!this.isBuilt){
			// add keyboard events here
		}
		$super();
	},
	createMenuElement: function($super){
		this.menuElement = new Element("ul").addClassName("OPIconBar");
		return this.menuElement;
	},
	
	nextItem: function(){
		if(this.activeItem && this.items.size()>1){
			var index = this.items.indexOf(this.activeItem);
			var found = false;
			var safety = this.items.size();
			
			while(found == false){
				index++;
				if(index>this.items.size()-1){
					index = 0;
				}
				
				var newItem = this.items[index];
				if(newItem.isClickable){
					found = true;
				}
				safety--;
				if(safety==0){
					found = true;
				}
			}
			
			if(newItem){
				newItem.click();
			}
		}
	},
	
	previousItem: function(){
		if(this.activeItem && this.items.size()>1){
			var index = this.items.indexOf(this.activeItem);
			var found = false;
			var safety = this.items.size();
			
			while(found == false){
				index--;
				if(index<0){
					index = this.items.size()-1;
				}
				
				var newItem = this.items[index];
				if(newItem.isClickable){
					found = true;
				}
				safety--;
				if(safety==0){
					found = true;
				}
			}
			
			if(newItem){
				newItem.click();
			}
		}
		
	}
});

