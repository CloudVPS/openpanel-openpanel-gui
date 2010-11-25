OpenPanel.Command.BuildIconBar  = {
	controller : {},
	execute : function(actionObject) {
		var iconBar = new OpenPanel.GUI.MenuIconBar("iconBar", $("iconBar"));
		OpenPanel.GUIBuilder.GUIElements.iconBar = iconBar;
		var crow1 = new Image(64, 64);
		crow1.src = "/images/icons/crow.png";
		var crow2 = new Image(32, 32);
		crow2.src = "/images/icons/down/crow.png";
		
		
		var crow = new OpenPanel.GUI.MenuIconBar.IconBarItem("Welcome").observe("mouseup", function(event){
			that.controller.action({
				command: "Welcome"
			});
		}).configure({
			icon: "/images/icons/crow.png",
			iconDown: "/images/icons/down/crow.png"
		});
		
		iconBar.addItem(crow);
		iconBar.addItem(new OpenPanel.GUI.MenuIconBar.IconBarSpacerItem());
		
		this.controller.dataManager.rootObject.getChildren();
		var openCoreObject = this.controller.dataManager.rootObject;
		
		var childObjects = new Hash();
		
		openCoreObject.children.each(function(childObject){
			var sortIndex = childObject.classInfo["class"].sortindex;
			var sameSortIndexChildren = childObjects.get(sortIndex);
			if(!sameSortIndexChildren){
				sameSortIndexChildren = new Array();
				childObjects.set(sortIndex, sameSortIndexChildren);
			}
			sameSortIndexChildren.push(childObject);
		});
		
		var that = this;
		childObjects.keys().sort(function(a,b){return a-b;}).each(function(sortIndex){
			var sameSortIndexChildren = childObjects.get(sortIndex);
			sameSortIndexChildren.each(function(childObject){
				var image = new Image(64, 64);
				image.src = "/dynamic/icons/" + childObject.uuid + ".png";
				var otherImage = new Image(32, 32);
				otherImage.src = "/dynamic/icons/down/" + childObject.uuid + ".png";
				
				var item = new OpenPanel.GUI.MenuIconBar.IconBarItem(childObject.title).observe("mouseup", function(event){
					that.controller.action({
						command : "ClickIconBarItem", 
						className : childObject.name
					});
				}).configure({
					icon: "/dynamic/icons/" + childObject.uuid + ".png",
					iconDown: "/dynamic/icons/down/" + childObject.uuid + ".png"
				});
				iconBar.addItem(item);
			});
		});

		iconBar.build();
		crow.select();
	}
}