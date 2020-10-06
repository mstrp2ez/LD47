"use strict";

(function(){
	
	class Planet extends Rotator{
		constructor(){
			super();
			this.rotation=0;
			this.mass=15000000;
			this.rotationspeed=0.1;
			this.radius=256;
		}
		onUpdate(time){
			this.rotation-=this.rotationspeed;
		}
		onRender(ctx){
			if(!this.loaded){return;}
			ctx.save();
			
				/* let dx=this.x+this.image.width/2;
				let dy=this.y+this.image.height/2;
				ctx.translate(dx,dy);
				ctx.rotate(this.rotation*Math.PI/180);
				ctx.translate(-dx,-dy); */
				ctx.beginPath();
				ctx.arc(this.x,this.y,this.radius,0,2*Math.PI,false);
				ctx.fillStyle='green';
				ctx.fill();
			
			ctx.restore();
		}
	}
	window.Planet=Planet;
})();