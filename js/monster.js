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
			
			this.player=SceneManager.getItemById("player");
			this.planet=SceneManager.getItemById("planet");
		}
		postLoad(){
			
		}
		onUpdate(time){
			super.onUpdate(time);
			
			if(this.isBlinking){
				if(!this.lastBlinkTimer){
					this.lastBlinkTimer=time;
				}else if(time-this.lastBlinkTimer>100){
					this.isBlinking=false;
					this.lastBlinkTimer=false;
				}
			}
			if(this.dead){
				if(this.deadTimer==false){
					this.deadTimer=time;
				}else if(time-this.deadTimer>this.deadDuration){
					SceneManager.removeChild(this);
					this.Unload();
				}
			}
			if(!this.player||this.dead){return;}
			let theta=this.rotation*Math.PI/180;
			
			let monsterPos=rotatedPosition(this.x,this.y,
				this.planet.x,
				this.planet.y,
				theta);
			let playerPos=rotatedPosition(this.player.x,this.player.y,
				this.planet.x,
				this.planet.y,
				this.player.rotation*Math.PI/180);
				
			let c=window.canvas.getCanvas();
			if(Math.abs(playerPos.x-monsterPos.x)<15){
				if(Math.abs(playerPos.y-monsterPos.y)<25){
					this.player.onDamageTaken(this);
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
	
	class MonsterSpawner extends SceneItem{
		constructor(){
			super();
			
			this.frequency=1000;
			this.template={};
			this.lastUpdate=0;
		}
		loadFromProperties(params){
			this.frequency=params.frequency==undefined?this.frequency:params.frequency;
			this.template=params.template==undefined?{}:params.template;
		}
		onUpdate(time){
			if(time-this.lastUpdate>this.frequency){
				this.lastUpdate=time;
				let nm=new Monster();
				nm.loadFromProperties(this.template);
				SceneManager.append(nm);
			}
		}
	}
	window.MonsterSpawner=MonsterSpawner;
	
})();