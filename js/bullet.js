"use strict";

(function(){
	const PLANET_CENTER_X=0;
	const PLANET_CENTER_Y=512;
	const PLANET_RADIUS=512;
	class Bullet extends SpriteAnimation{
		constructor(){
			super();
			this.lastBulletUpdate=undefined;
			this.lifeSpan=5000;
			this.dead=false;
			this.velx=2.7;
			this.vely=-3;
			this.mass=2;
			this.dmg=1;
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
			this.velx=params.velx===undefined?0:params.velx;
			this.vely=params.vely===undefined?0:params.vely;
		}
		onUpdate(time){
			super.onUpdate(time);
			if(this.lastBulletUpdate==undefined){
				this.lastBulletUpdate=time;
			}
			if(time-this.lastBulletUpdate>this.lifeSpan){
				this.dead=true;
				this.spawnExplosion();
				true;
			}
			
			let p=SceneManager.getItemsByType(Planet)[0];
			this.x+=this.velx;
			this.y+=this.vely;
			let dx=PLANET_CENTER_X-this.x;
			let dy=PLANET_CENTER_Y-this.y;
			let r=Math.sqrt(dx*dx+dy*dy);
			let f=(0.4966743*(this.mass*p.mass)/r);
			let u=1/r;
			dx*=u;
			dy*=u;
			
			this.velx+=dx*f;
			this.vely+=dy*f;

			if(r<PLANET_RADIUS){
				this.dead=true;
				this.spawnExplosion();
				return;
			}
			
			let monsters=SceneManager.getItemsByType(window.Monster);
			for(let i=0;i<monsters.length;i++){
				let monster=monsters[i];
				if(monster.isDead()){continue;}
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
						this.spawnExplosion();
						this.dead=true;
					}
				}
			}
		}
		onRender(ctx){
			if(!this.dead){
				super.onRender(ctx);
			}
			
			for(let i=0;i<this.children.length;i++){
				this.children[i].onRender(ctx);
			}
		}
		spawnExplosion(){
			let expl=new RotatorAnimation();
			expl.loadFromProperties({
				'x':this.x,
				'y':this.y-30,
				'animsrc':'assets/animations/explosion.json',
				'angle':0,
				'offsetx':0,
				'offsety':512,
				'rotationspeed':0.3
			});
			expl.registerEventlistener('end_of_animation',function(){
				SceneManager.removeChild(expl);
			}.bind(this));
			SceneManager.append(expl);
		}
		isDead(){
			return this.dead;
		}
	}
	window.Bullet=Bullet;
	
})();