"use strict";

(function(){
	
	class AnimationCollection{
		constructor(){
			this.items=[];
		}
		append(item){
			this.items.push(item);
		}
	}
	AnimationCollection.prototype.each=function(callback){
		for(let i=0;i<this.items.length;i++){
			callback(this.items[i]);
		}
	}
	
	const PLAYER_PADDING_Y=0;
	const PLAYER_KEY_RIGHT=39;
	const PLAYER_KEY_LEFT=37;
	const PLAYER_KEY_UP=38;
	const PLAYER_KEY_DOWN=40;
	
	
	window.INVENTORY_STATS_KEY="Inventory";
	class Player extends SceneItem{
		constructor(params){
			super(params);
			this.keyMap=[];
			this.hp=100;
			this.mana=10;
			this.id='player';
			this.moveTarget=null;
			this.keyMap.fill(false,0);
			this.loaded=true;
			this.animsrc="";
			this.didMove=false;
			this.moveCount=0;
			this.animationCollection=new AnimationCollection();
			this.currentScene=window.currentScene;
			this.inWorldScene=this.currentScene.getSceneProperty('worldscene');
			this.lastUpdate=0;
			this.target=null;
			this.keys=Array(256).fill(false);
			//this.interactables=[];
			
			this.movementTranslationMap=[-1,2,4,3,6,-1,5,-1,0,1,-1,-1,7,-1,-1,-1];

		 	$(document).on('keydown.Player',this.onKeydown.bind(this));
			$(document).on('keyup.Player',this.onKeyup.bind(this));
			//$(window.canvas.getCanvas()).on('mousedown.Player',this.onMousedown.bind(this));
			
		}
		getPlayerStats(){
			return window.Session.getItem(PLAYER_STATS_KEY);
		}
		setPlayerStats(stats){
			window.Session.setItem(PLAYER_STATS_KEY,JSON.stringify(stats));
		}
		loadFromProperties(p_properties){
			super.loadFromProperties(p_properties);
			this.layer=p_properties.hasOwnProperty("layer")?p_properties.layer:"";
			this.animsrc=p_properties.animsrc;
			this.id=p_properties.hasOwnProperty("id")?p_properties.id:"";
			this.hp=p_properties.hasOwnProperty("hp")?p_properties.hp:100;
			this.mana=p_properties.hasOwnProperty("mana")?p_properties.mana:10;
			if(window.currentScene.getSceneProperty('worldscene')){
				this.loadFromSession();
			}
		}
		postLoad(){
			//this.interactables=window.SceneManager.getItemsByType(Interactable);
		}
		setLocation(x,y){
			this.x=x;
			this.y=y;
			
			this.saveLocation();
		}
		append(child){
			super.append(child);
			if(child.type=="Animation"){
				this.animationCollection.append(child);
			}
		}
		onKeydown(event){
			if(window.menuOpen){return;}
			this.keys[event.which]=true;
		}
		onKeyup(event){
			if(window.menuOpen){return;}
			this.keys[event.which]=false;
		}
		saveLocation(){
			window.Session.setItem('player',JSON.stringify(
				{
					'x':this.x,
					'y':this.y
				}
			));
		}
		Unload(){
			$(window.canvas.getCanvas()).off('keydown.Player');
			$(window.canvas.getCanvas()).off('keyup.Player');
			
			this.saveLocation();
			
			this.GUI=null;
			super.Unload();
		}
		loadFromSession(){
			if(!window.Session.hasItem('player')){return;}
			let saved=JSON.parse(window.Session.getItem('player'));
			this.x=Math.round(saved.x);
			this.y=Math.round(saved.y);
		}
		findMovementTarget(){
			let tilemap=SceneManager.getItemById('tilemap');
			if(!tilemap){return;}
			let keys=this.keys;
			let dirSum=0;
			dirSum+=keys[PLAYER_KEY_UP]?1:0;
			dirSum+=keys[PLAYER_KEY_RIGHT]?2:0;
			dirSum+=keys[PLAYER_KEY_DOWN]?4:0;
			dirSum+=keys[PLAYER_KEY_LEFT]?8:0;
			
			if(keys[PLAYER_KEY_UP]){
				this.animationCollection.each(function(item){item.setAnimation("walk_up");});
			}
			if(keys[PLAYER_KEY_DOWN]){
				this.animationCollection.each(function(item){item.setAnimation("walk_down");});
			}
			if(keys[PLAYER_KEY_RIGHT]){
				this.animationCollection.each(function(item){item.setAnimation("walk_right");});
			}
			if(keys[PLAYER_KEY_LEFT]){
				this.animationCollection.each(function(item){item.setAnimation("walk_left");});
			}
			
			let index=this.movementTranslationMap[dirSum];
			
			let currentTile=tilemap.getTileByCoord(this.x,this.y);
			if(currentTile===null){return;}
			let neighbors=currentTile.getNeighbors();
			let targetTile=neighbors[index];
			if(targetTile!==null&&targetTile.index!=15){
				this.target=[{'node':neighbors[index]}];
			}
		}
	}
	
	Player.prototype.isInWorldScene=function(){
		return this.inWorldScene;
	}
	Player.prototype.getHp=function(){
		return this.hp;
	}
	Player.prototype.getMana=function(){
		return this.mana;
	}
	Player.prototype.onMousedown=function(event){
		let tilemap=SceneManager.getItemById('tilemap');
		if(!tilemap){return;}
		let c=window.Camera;
		let canvas=window.canvas.getCanvas();
		let clientX=event.clientX+(c.centerx-canvas.width/2);
		let clientY=event.clientY+(c.centery-canvas.height/2);
		let tx=this.x;
		let ty=this.y;
		
		let startTile=tilemap.getTileByCoord(tx,ty);
		let endTile=tilemap.getTileByCoord(clientX,clientY);
		
		let path=tilemap.pathTo(startTile,endTile);
		this.target=path;
	}
	Player.prototype.onUpdate=function(time){
		this.updateMovement(time);
		
		for(var i=0;i<this.children.length;i++){
			this.children[i].onUpdate(time);
		}
	}
	Player.prototype.updateMovement=function(time){
		let keys=this.keys;
		if(this.target==null && (keys[PLAYER_KEY_LEFT] || keys[PLAYER_KEY_RIGHT] || keys[PLAYER_KEY_UP] || keys[PLAYER_KEY_DOWN])){
			this.findMovementTarget();
		}
		
		this.didMove=false;
		if(this.target!=null&&this.target.length>0){
			let next=this.target[this.target.length-1];
			let nextTile=next.node;
			let dx=nextTile.x-this.x;
			let dy=nextTile.y+PLAYER_PADDING_Y-this.y+PLAYER_PADDING_Y;
			let len=Math.sqrt(dx*dx+dy*dy);
			if(len<=1){
				let endTile=this.target.pop();
				if(this.target.length<=0){
					this.target=null;
					this.x=endTile.node.x;
					this.y=endTile.node.y;
				}
				return;
			}
			
			dx=dx/len;
			dy=dy/len;
			this.x+=dx*2;
			this.y+=dy*2;
			this.didMove=true;
			
			this.updateAnimationAfterMovement(dx,dy);
		}else{
			this.didMove=false;
			//this.animationCollection.each(function(item){item.setAnimation("idle");});
		}
	}
	Player.prototype.updateAnimationAfterMovement=function(dx,dy){
		if(Math.abs(dx)>=Math.abs(dy)){
			if(dx>0){
				this.animationCollection.each(function(item){item.setAnimation("walk_right");});
			}else{
				this.animationCollection.each(function(item){item.setAnimation("walk_left");});
			}
		}else{
			if(dy>0){
				this.animationCollection.each(function(item){item.setAnimation("walk_down");});
			}else{
				this.animationCollection.each(function(item){item.setAnimation("walk_up");});
			}
		}
	}
	
	Player.prototype.onRender=function(ctx){
		var wc=this.calculateWorldCoordinates();
		
		for(var i=0;i<this.children.length;i++){
			this.children[i].onRender(ctx);
		}
	}
	/* Player.prototype.onKeyup=function(event){
		let w=event.which;
		this.keyMap[w]=false;
	}
	Player.prototype.onKeydown=function(event){
		let w=event.which;
		this.keyMap[w]=true;
		
	} */
	
	window.Player=Player;
	
	
	
})();