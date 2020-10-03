"use strict";


(function(){
	
	class Player extends SpriteAnimation{
		constructor(){
			super();
			
			this.bullets=[];
			$(document).on('keydown.player',this.onKeydown.bind(this));
		}
		onKeydown(event){
			let key=event.which;
			console.log(key);
			if(key==32){
				this.fireGun();
			}
		}
		fireGun(){
			let bullet=new Bullet();
			bullet.loadFromProperties({
				'x':this.x+20,
				'y':this.y-20,
				'animsrc':'assets/animations/bullet1.json',
				'offsetx':0,
				'offsety':512,
				'rotationspeed':-2,
				'angle':0,
				'layer':3
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