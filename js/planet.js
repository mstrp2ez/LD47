"use strict";

(function(){
	
	class Planet extends Sprite{
		constructor(){
			super();
			this.rotation=0;
			this.mass=10;
		}
		onUpdate(time){
			this.rotation-=0.1;
		}
		onRender(ctx){
			if(!this.loaded){return;}
			ctx.save();
			
				let dx=this.x+this.image.width/2;
				let dy=this.y+this.image.height/2;
				ctx.translate(dx,dy);
				ctx.rotate(this.rotation*Math.PI/180);
				ctx.translate(-dx,-dy);
				ctx.drawImage(this.image,this.x,this.y);
			
			ctx.restore();
		}
	}
	window.PLANET_CENTER_X=512;
	window.PLANET_CENTER_Y=512;
	window.Planet=Planet;
})();