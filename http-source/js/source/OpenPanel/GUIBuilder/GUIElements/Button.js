OpenPanel.GUIBuilder.GUIElements.Button = {
	renderButton : function(el, isDefault, isSmall){
		// crap code, needs refactoring, ugly as f
		var buttonText = el.innerHTML;
		el.innerHTML = "";
		var button = document.createElement("div");
		button.setAttribute("type", "submit");
		button.className = "generatedButton";
		el.appendChild(button);
		
		var t = document.createElement("table");
		t.setAttribute("border", "0");
		t.setAttribute("cellpadding", "0");
		t.setAttribute("cellspacing", "0");
		// IE7 is a fucking idiot
		t.style.cssText="border-collapse: collapse";
		var tb = document.createElement("tbody");
		tb.style.cssText = "border: 0px;";
		var tr = document.createElement("tr");
		tr.style.cssText = "border: 0px;";
		var left = document.createElement("td");
		var center = document.createElement("td");
		var right = document.createElement("td");
		var txtDiv = document.createElement("div");
		txtDiv.className = "guiButtonText";
		var txt = document.createTextNode(buttonText);
		txtDiv.appendChild (txt);
		t.appendChild(tb);
		tb.appendChild(tr);
		tr.appendChild(left);
		tr.appendChild(center);
		tr.appendChild(right);
		center.appendChild(txtDiv);
		center.style.cursor = "default";
		button.appendChild(t);
		
		var renderDefaultButton = (isDefault!=undefined)?isDefault:false;
		var renderSmallerButton = (isSmall!=undefined)?isSmall:false;
		
		var bL = "buttonLeft";
		var bR = "buttonRight";
		var bC = "buttonCenter";
		
		if (renderSmallerButton) {
			bL = "formButtonLeft";
			bR = "formButtonRight";
			bC = "formButtonCenter";
		}
		
		if (renderDefaultButton) {
			button.onmouseup = function(){
				left.className = bL + "Over";
				right.className = bR + "Over";
				center.className = bC + "Over";
			}
		
			button.onmousedown = function(){
				left.className = bL;
				right.className = bR;
				center.className = bC;
			}
		} else {
			button.onmousedown = function(){
				left.className = bL + "Over";
				right.className = bR + "Over";
				center.className = bC + "Over";
			}
		
			button.onmouseup = function(){
				left.className = bL;
				right.className = bR;
				center.className = bC;
			}
		}
		button.onmouseup();
	}
}