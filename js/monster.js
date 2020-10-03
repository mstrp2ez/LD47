"use strict";

(function(){
	
	class Monster extends RotatorAnimation{
		constructor(){
			super();
			this.lastBlinkTimer=false;
			this.isBlinking=false;
			this.dead=false;
			this.deadTimer=false;
			this.deadDuration=5000;
			this.shouldRemove=false;
			this.life=1;
		}

		onUpdate(time){
			super.onUpdate(time);
			/* let theta=this.rotation*Math.PI / 180;
			let ox=this.x+this.offsetx;
			let oy=this.y+this.offsety;
			
			let newx=Math.cos(theta) * (this.x-ox) - Math.sin(theta) * (this.y-oy) + ox;
			let newy=Math.sin(theta) * (this.x-ox) + Math.cos(theta) * (this.y-oy) + oy; */
			if(this.isBlinking){
				if(!this.lastBlinkTimer){
					this.lastBlinkTimer=time;
				}else if(time-this.lastBlinkTimer>100){
					this.isBlinking=false;
					this.lastBlinkTimer=false;
				}
			}
			if(this.dead){
				if(this.deadTimer=false){
					this.deadTimer=time;
				}else if(time-this.deadTimer>this.deadDuration){
					SceneManager.removeChild(this);
					this.Unload();
				}
			}

		}
		onRender(ctx){
			ctx.save();
				if(this.isBlinking){
					ctx.globalCompositeOperation='screen';
				}
				super.onRender(ctx);
			ctx.restore();
		}
		onDamageTaken(actor){
			this.isBlinking=true;
			
			this.life-=actor.dmg;
			if(this.life<=0){
				this.setAnimation("dead");
				this.rotationspeed=0.1;
				this.dead=true;
			}
			
		}
		shouldRemove(){
			return this.shouldRemove;
		}
		isDead(){
			return this.dead;
		}
	}
	window.Monster=Monster;
	
	class MonsterSpawner{
		
		
	}
	window.MonsterSpawner=MonsterSpawner;
	
})();