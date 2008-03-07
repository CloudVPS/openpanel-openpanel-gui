var Throbber = {
			maxFrames : 12,
			i : 1,
			timeout : 200,
			targetDiv : {},
			
			
			start : function(){
				if (this.throbberTimeout == undefined) {
					this.throbberTimeout = setTimeout("Throbber.f()", this.timeout);
				}
			},
			
			stop : function(){
				clearTimeout(this.throbberTimeout);
				this.throbberTimeout = undefined;
			},
			
			f : function(){
				if(this.i < this.maxFrames){
					this.i++;
				} else {
					this.i = 1;
				}
				this.animate();
				if (this.needToStop == true) {
					this.needToStop = false;
				} else {
					this.start();
				}
			},
			
			setTargetDiv : function(targetDiv){
				this.targetDiv = targetDiv;
				this.targetDiv.setAttribute("class", "throbber");
				console.log(this.targetDiv);
			},
			
			animate : function(){
				var pic = new Image(50,50); 
				var imageUrl = "/images/gui/zoomspin/zoom-spin-" + this.i+ ".png";
				pic.src = imageUrl;
				this.targetDiv.innerHTML = "<img src=\""+imageUrl+"\"/>";
			}
		}
		