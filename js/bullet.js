"use strict";

(function(){
	const PLANET_RADIUS=256;
	class Bullet extends SpriteAnimation{
		constructor(){
			super();
			this.lastBulletUpdate=undefined;
			this.lifeSpan=50000;
			this.dead=false;
			this.velx=2.7;
			this.vely=-3;
			this.mass=2;
			this.dmg=1;
			
			this.planet=SceneManager.getItemsByType(Planet)[0];
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
			if(this.dead){
				return;
			}
			
			let p=this.planet;
			this.x+=this.velx;
			this.y+=this.vely;
			let dx=this.planet.x-this.x;
			let dy=this.planet.y-this.y;
			let r=Math.sqrt(dx*dx+dy*dy);
			let f=(0.0000004966743*(this.mass*p.mass)/r);
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
				
				let ox=this.planet.x;
				let oy=this.planet.y;
				
				let obj=rotatedPosition(mx,my,ox,oy,theta);
				
				let dist=distanceTo({'x':this.x,'y':this.y},{'x':obj.x,'y':obj.y});
				if(dist<16){
					monster.onDamageTaken(this);
					this.spawnExplosion();
					this.dead=true;
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
			let player=SceneManager.getItemById("player");
			let p=this.planet;
			let dx1=player.x-p.x;
			let dy1=player.y-p.y;
			
			let dx2=this.x-p.x;
			let dy2=this.y-p.y;
			
			let angle = Math.atan2(dx1 * dx2 - dy1 * dx2, dx1 * dx2 + dy1 * dy2);
			if (angle < 0) {
				angle += Math.PI*2;
			}
			
			let expl=new RotatorAnimation();
			expl.loadFromProperties({
				'x':500,
				'y':115,
				'animsrc':'assets/animations/explosion.json',
				'angle':angle*180/Math.PI,
				'rotationspeed':0.1
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