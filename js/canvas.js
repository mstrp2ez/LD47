"use strict";


(function(){
	
	class Canvas{
		constructor(){
			this.canvas=null;
			this.context=null;
			this.gradient=null;
		}
	}
	
	Canvas.prototype.build=function(p_Target){
		$(p_Target).append($('<canvas id="canvas" width="1000" height="800"></canvas>'));
		this.canvas=document.getElementById('canvas');
		this.context=this.canvas.getContext('2d');
		//this.gradient=this.context.createLinearGradient(0,0,0,this.canvas.height/3);
		let hw=this.canvas.width/2;
		let hh=this.canvas.height/2;
		this.gradient=this.context.createRadialGradient(hw,hh,650,hw,hh,400);
		this.gradient.addColorStop(0,'#000');
		//this.gradient.addColorStop(0.5,'#82CCC7');
		this.gradient.addColorStop(1,'#82CCC7');
	}
	
	Canvas.prototype.ClearScreen=function(){
		this.context.fillStyle=this.gradient;
		this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
	}
	
	Canvas.prototype.getContext=function(){
		return this.context;
	}
	
	Canvas.prototype.getCanvas=function(){
		return this.canvas;
	}
	
	window.canvas=new Canvas();
	
})();