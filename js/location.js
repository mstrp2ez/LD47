"use strict";

(function(){
	
	class Exit extends SceneItem{
		constructor(params){
			super(params);
			this.lastUpdate=0;
			this.updateDelay=100;
			this.respawnLocation=null;
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
			this.target=params.target;
			
			this.respawnlocation=params.respawnlocation===undefined?null:params.respawnlocation;
		}
		onUpdate(time){
			if(time-this.lastUpdate>this.updateDelay){
				let player=window.SceneManager.getItemById("player");
				if(!player.didMove){return;}
				let cx=this.x;
				let cy=this.y;
				let cw=this.w;
				let ch=this.h;
				
				let px=player.x;
				let py=player.y;
				if(px>=cx&&px<cx+cw){
					if(py>=cy&&py<cy+ch){
						if(this.hasRespawnLocation()){
							window.Session.setItem("spawn",JSON.stringify(this.respawnlocation));
						}
						window.currentScene.loadScene(this.target);
					}
				}
				
				
				this.lastUpdate=time;
			}
			super.onUpdate(time);
		}
		hasRespawnLocation(){
			return this.respawnlocation!=null;
		}
		onRender(ctx){
			super.onRender(ctx);
			//ctx.fillRect(this.x,this.y,32,32);
		}
	}
	
	window.Exit=Exit;
	
	
	class City extends Exit{
		constructor(params){
			super(params);
		}
	}
	
	window.City=City;
	
	
})();