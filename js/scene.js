"use strict";

(function(){
	
	class Scene{
		constructor(){
			this.name="";
			this.sceneSrc=null;
			this.assetsLoading=0;
			this.sceneProperties={};
			this.monsterClasses=[];
			this.lastSceneProps={};
			window.currentScene=this;
			this.GUI=null;
		}
		getGUI(){
			return this.GUI;
		}
	}

	Scene.prototype.loadScene=function(src){
		this.lastSceneProps=this.sceneProperties;
		if(this.sceneSrc!==null){
			window.Session.setItem('last_scene',this.sceneSrc);
		}
		this.sceneSrc=src;
		this.Unload();
		$.getJSON(src,{},function(json){this.onLoad(json,src);}.bind(this));
	}
	
	Scene.prototype.onLoad=function(json,src){
		this.GUI=new GUI();
		this.GUI.Load(json.gui,function(){
			this.parseSceneProperties(json.properties);
			
			let sceneItems=json.items;
			this.assetsLoading=sceneItems.length;
			this.parseScene(sceneItems,SceneManager);
			SceneManager.postLoad();
			
			let player=SceneManager.getItemById('player');
			if(player!=null){
				// let spawn=window.Session.getItem("spawn");
				// if(spawn!=null){
					// spawn=JSON.parse(spawn);
					// player.setLocation(spawn.x,spawn.y);
					// window.Session.removeItem("spawn");
				// }
				window.Camera.setTarget(player);
			}
			
			window.Session.setItem('current_scene',src);
			window.requestAnimationFrame(this.run.bind(this));
		}.bind(this));
	}
	
	Scene.prototype.loadMonsterClasses=function(callback){
		$.getJSON('assets/combat/monsterclasses.json',function(data){
			let mc=this.getLastSceneProperty("monsterclass");
			if(mc>=data.length){mc=0;}
			this.monsterClasses=data[mc];
			if(callback){callback(this.monsterClasses);}
		}.bind(this));
	}
	Scene.prototype.getSceneProperty=function(key){
		let p=this.sceneProperties;
		if(p==undefined){
			return undefined;
		}
		return p.hasOwnProperty(key)?p[key]:undefined;
	}
	Scene.prototype.getLastSceneProperty=function(key){
		let p=this.lastSceneProps;
		return p.hasOwnProperty(key)?p[key]:undefined;
	}
	Scene.prototype.parseSceneProperties=function(properties){
		this.sceneProperties=properties;
	}
	
	Scene.prototype.parseScene=function(json,parent){
		for(let i=0;i<json.length;i++){
			let item=json[i];
			let type=item.type;
			console.log("Loading: "+type);
			let newItem=new window[type]();
			newItem.loadFromProperties(item);
			
			if(item.exempt==undefined||item.exempt==false){
				parent.append(newItem);
			}
			
			if(item.hasOwnProperty("children")){
				this.parseScene(item.children,newItem);
			}
		}
	}
	Scene.prototype.parseDialogs=function(dialogs){
		
		
	}
	
	Scene.prototype.run=function(time){
		let cnvs=window.canvas;
		let ctx=cnvs.getContext();
		cnvs.ClearScreen();
		
		SceneManager.onUpdate(time);
		SceneManager.onRender(ctx);
		
		if(this.GUI){
			this.GUI.onUpdate(time);
			this.GUI.onRender(ctx);
		}
		window.requestAnimationFrame(this.run.bind(this));
	}
	
	Scene.prototype.init=function(){
		
	}
	
	Scene.prototype.Unload=function(){
		SceneManager.Unload();
		if(this.GUI){
			this.GUI.Unload();
			this.GUI=null;
		}
	}
	
	window.Scene=Scene;
	
})();