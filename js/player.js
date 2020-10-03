"use strict";


(function(){
	
	class Player extends SpriteAnimation{
		constructor(){
			super();
			
			this.bullets=[];
			$('#canvas').on('click.player',this.onClick.bind(this));
		}
		onClick(event){
			let offsetX=event.offsetX;
			let offsetY=event.offsetY;
			
			let hw=window.canvas.getCanvas().width/2;
			let hh=window.canvas.getCanvas().height/2
			
			let dx=offsetX-(this.x+hw);
			let dy=offsetY-(this.y+hh);
			
			let len=Math.sqrt(dx*dx+dy*dy);
			let d=1/len;
			
			dx*=d;
			dy*=d;
			
			this.fireGun(dx*len/100,dy*len/100);
			event.preventDefault();
		}
		fireGun(dx,dy){
			let bullet=new Bullet();
			bullet.loadFromProperties({
				'x':this.x+20,
				'y':this.y-20,
				'animsrc':'assets/animations/bullet1.json',
				'offsetx':0,
				'offsety':512,
				'rotationspeed':-2,
				'angle':0,
				'layer':3,
				'velx':dx,
				'vely':dy
			});
			this.bullets.push(bullet);
			this.append(bullet);
		}
		onUpdate(time){
			for(let i=0;i<this.bullets.length;i++){
				let bullet=this.bullets[i];
				if(bullet.isDead()){
					this.bullets.splice(i,1);
					this.removeChild(bullet);
					i=0;
				}
				bullet.onUpdate(time);
			}
			
		}
		onRender(ctx){
			super.onRender(ctx);
			
			for(let i=0;i<this.children.length;i++){
				this.children[i].onRender(ctx);
			}
		}
	}
	
	window.Player=Player;
	
})();