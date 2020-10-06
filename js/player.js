"use strict";


(function(){
	
	class Player extends RotatorAnimation{
		constructor(){
			super();
			
			this.bullets=[];
			this.dead=false;
			this.walkSpeed=0.5;
			this.jumpSpeed=2;
			this.isJumping=false;
			this.mass=2;
			this.velx=0;
			this.vely=0;
			this.rotation=0;
			//this.rotationspeed=0.1;
			$('#canvas').on('click.player',this.onClick.bind(this));
			$(document).on('keydown.player',this.onKeydown.bind(this));
			$(document).on('keyup.player',this.onKeyup.bind(this));
			this.keys=[];
			for(let i=0;i<255;i++){
				this.keys[i]=false;
			}
		}
		postLoad(){
			this.planet=SceneManager.getItemsByType(Planet)[0];
			this.setAnimation("idle");
			
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
		}
		onClick(event){
			if(this.dead){return;}
			let offsetX=event.offsetX;
			let offsetY=event.offsetY;
			
			let convPos=rotatedPosition(this.x,this.y,this.planet.x,this.planet.y,this.rotation*Math.PI/180);
			
			let dx=offsetX-(convPos.x);
			let dy=offsetY-(convPos.y);
			
			this.fireGun(dx/80,dy/80);
			event.preventDefault();
		}
		onKeyup(event){
			this.keys[event.which]=false;
		}
		onKeydown(event){
			this.keys[event.which]=true;
			if(this.keys[32]){
				this.jump();
			}
		}
		jump(){
			let ap=rotatedPosition(this.x,this.y,this.planet.x,this.planet.y,this.rotation*Math.PI/180);
			let dx=ap.x-this.planet.x;
			let dy=ap.y-this.planet.y;
			
			let len=Math.sqrt(dx*dx+dy*dy);
			let u=1/len;
			dx*=u;
			dy*=u;
			
			this.x+=dx; //nudge player out up to one pixel;
			this.y+=dy;
			
			this.velx=dx*this.jumpSpeed;
			this.vely=dy*this.jumpSpeed;
			
			this.isJumping=true;			
		}
		fireGun(dx,dy){
			let bullet=new Bullet();
			
			let nx=this.planet.x-this.x;
			let ny=this.planet.y-this.y;
			let ap=rotatedPosition(this.x,this.y,this.planet.x,this.planet.y,this.rotation*Math.PI/180);
			
			bullet.loadFromProperties({
				'x':ap.x,
				'y':ap.y,
				'animsrc':'assets/animations/bullet1.json',
				'layer':2,
				'velx':dx,
				'vely':dy
			});
			this.bullets.push(bullet);
			SceneManager.append(bullet);
		}
		onUpdate(time){
			super.onUpdate(time);
			for(let i=0;i<this.bullets.length;i++){
				let bullet=this.bullets[i];
				if(bullet.isDead()){
					this.bullets.splice(i,1);
					SceneManager.removeChild(bullet);
					i=0;
				}
				bullet.onUpdate(time);
			}
			if(this.keys[37]){
				this.moveLeft();
				this.setAnimation("walk_left");
			}else if(this.keys[39]){
				this.moveRight();
				this.setAnimation("walk_right");
			}else{
				this.setAnimation("idle");
			}
			//this.simulateGravity();
		
		}
		moveLeft(){
		/* 	let dx=this.planet.x-this.x;
			let dy=this.planet.y-this.y;
			let norm=normalize(dx,dy);
			let convx=-norm.y;
			let convy=norm.x;
			this.x+=convx;
			this.y+=convy; */
			this.rotation-=this.walkSpeed;
		}
		moveRight(){
			/* let dx=this.planet.x-this.x;
			let dy=this.planet.y-this.y;
			let norm=normalize(dx,dy);
			let convx=norm.y;
			let convy=-norm.x;
			this.x+=convx;
			this.y+=convy; */
			this.rotation+=this.walkSpeed;
		}
		simulateGravity(){
			let p=this.planet;
			
			let dx=this.planet.x-this.x;
			let dy=this.planet.y-this.y;
			let r=Math.sqrt(dx*dx+dy*dy);
			if(r<=this.planet.radius+20){ //plus player height
				return;
			}
			
			let f=(0.0000004966743*(this.mass*p.mass)/r);
			let u=1/r;
			dx*=u;
			dy*=u;
			
			this.velx+=dx*f;
			this.vely+=dy*f;
			
			this.x+=this.velx;
			this.y+=this.vely;
			
		}
		
		onDamageTaken(actor){
			this.setAnimation("dead");
			this.dead=true;
			let rotators=SceneManager.getItemsByType(Rotator);
			let animRotators=SceneManager.getItemsByType(RotatorAnimation);
			let rots=rotators.concat(animRotators);
			for(let i=0;i<rots.length;i++){
				rots[i].rotationspeed=0;
			}
			let gui=window.currentScene.getGUI();
			gui.getWidgetByName("lostwidget").setVisibility(true);
		}
		Unload(){
			$('#canvas').off('click.player');
			$('#canvas').off('keydown.player');
		}
	}
	
	window.Player=Player;
	
})();