var Throbber = {
			maxFrames : 12,
			i : 1,
			timeout : 200,
			targetDiv : {},
			
			
			start : function(){
				if(Throbber.throbberTimeout != undefined){
					this.stop();
				}
				
				if (Throbber.throbberTimeout == undefined) 
				{
					Throbber.throbberTimeout = setTimeout("Throbber.f()", this.timeout);
				}
			},
			
			stop : function(){
				clearTimeout(Throbber.throbberTimeout);
				Throbber.throbberTimeout = undefined;
			},
			
			f : function(){
				if(this.i < this.maxFrames){
					this.i++;
				} else {
					this.i = 1;
				}
				this.animate();
				this.start();
				
			},
			
			setTargetDiv : function(targetDiv){
				this.targetDiv = targetDiv;
				this.targetDiv.setAttribute("class", "throbber");
			},
			
			animate : function()
			{
				if (this.targetDiv.innerHTML.match('newTrobber') != -1)
				{
					var imageUrl = "/images/gui/newTrobber.gif";
					this.targetDiv.innerHTML = "<img src=\""+imageUrl+"\"/>";
				}

				/*
				var pic = new Image(50,50); 
				var imageUrl = "/images/gui/zoomspin/zoom-spin-" + this.i+ ".png";
				pic.src = imageUrl;
				this.targetDiv.innerHTML = "<img src=\""+imageUrl+"\"/>";
				*/
			}
		}
		