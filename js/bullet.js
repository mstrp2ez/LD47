"use strict";

(function(){
	
	class Bullet extends SpriteAnimation{
		constructor(){
			super();
			this.lastBulletUpdate=undefined;
			this.lifeSpan=5000;
			this.dead=false;
			this.velx=4.7;
			this.vely=0;
		}

		onUpdate(time){
			super.onUpdate(time);
			if(this.lastBulletUpdate==undefined){
				this.lastBulletUpdate=time;
			}
			if(time-this.lastBulletUpdate>this.lifeSpan){
				this.dead=true;
			}
			this.x+=this.velx;
			this.y+=this.vely;
			this.vely+=0.055;
			
			let monsters=SceneManager.getItemsByType(window.Monster);
			for(let i=0;i<monsters.length;i++){
				let monster=monsters[i];
				let mx=monster.x;
				let my=monster.y;
				let theta=monster.rotation*Math.PI/180;
				
				let ox=mx+monster.offsetx;
				let oy=my+monster.offsety;
				
				let newx=Math.cos(theta) * (mx-ox) - Math.sin(theta) * (my-oy) + ox;
				let newy=Math.sin(theta) * (mx-ox) + Math.cos(theta) * (my-oy) + oy;
				
				if(Math.abs(this.x-newx)<10){
					if(Math.abs(this.y-newy)<10){
						monster.onDamageTaken(this);
					}
				}
			}
		}
		isDead(){
			return this.dead;
		}
	}
	window.Bullet=Bullet;
	
})();