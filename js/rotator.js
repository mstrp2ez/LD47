"use strict";

(function(){
	
	class Rotator extends Sprite{
		constructor(){
			super();
			this.rotation=0;
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
			
			this.offsetx=params.offsetx==undefined?0:params.offsetx;
			this.offsety=params.offsety==undefined?0:params.offsety;
			this.rotationspeed=params.rotationspeed==undefined?0:params.rotationspeed;
			this.rotation=params.angle==undefined?0:params.angle;
		}
		onUpdate(time){
			this.rotation=(this.rotation - this.rotationspeed)%360;
		}
		onRender(ctx){
			if(!this.loaded){return;}
			
			ctx.save();
				let dx=this.offsetx;
				let dy=this.offsety;
				ctx.translate(dx,dy);
				ctx.rotate(this.rotation*Math.PI/180);
				ctx.translate(-dx,-dy);
				ctx.drawImage(this.image,this.x,this.y);
			ctx.restore();
		}
	}
	window.Rotator=Rotator;
	
	
	class RotatorAnimation extends SpriteAnimation{
		constructor(){
			super();
			this.rotation=0;
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
			
			this.offsetx=params.offsetx==undefined?0:params.offsetx;
			this.offsety=params.offsety==undefined?0:params.offsety;
			this.rotationspeed=params.rotationspeed==undefined?0:params.rotationspeed;
			this.rotation=params.angle==undefined?0:params.angle;
		}
		onUpdate(time){
			this.rotation=(this.rotation - this.rotationspeed)%360;
			super.onUpdate(time);
		}
		onRender(ctx){
			if(!this.loaded){return;}
			
			ctx.save();
				let dx=this.offsetx;
				let dy=this.offsety;
				ctx.translate(dx,dy);
				ctx.rotate(this.rotation*Math.PI/180);
				ctx.translate(-dx,-dy);
				super.onRender(ctx);
			ctx.restore();
		}
	}
	window.RotatorAnimation=RotatorAnimation;
	
})();