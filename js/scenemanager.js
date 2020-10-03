"use strict";

(function(){

	class SceneItem{
		constructor(params){
			if(params){
				this.x=params.x==undefined?0:params.x;
				this.y=params.y==undefined?0:params.y;
				this.w=params.w==undefined?0:params.w;
				this.h=params.h==undefined?0:params.h;
				this.layer=params.layer==undefined?0:params.layer;
			}
			
			this.children=[];
			this.parent=null;
			this.id="";
			this.tags=[];
			this.loaded=false;
			this.noDraw=true;
		}
		loadFromProperties(params){
			this.x=!params.hasOwnProperty("x")?0:params.x;
			this.y=!params.hasOwnProperty("y")?0:params.y;
			this.w=!params.hasOwnProperty("w")?0:params.w;
			this.h=!params.hasOwnProperty("h")?0:params.h;
			this.layer=!params.hasOwnProperty("layer")?0:params.layer;
		}
		append(child){
			this.children.push(child);
			child.parent=this;
		}
		removeChild(child){
			let idx=this.children.indexOf(child);
			if(idx==-1){return;}
			this.children.splice(idx,1);
		}
		onRender(ctx,gui){
			if(!this.noDraw){
				var wc=this.calculateWorldCoordinates();
				ctx.fillStyle="#333";
				ctx.fillRect(wc.x,wc.y,this.w,this.h);
			}
			for(var i=0;i<this.children.length;i++){
				this.children[i].onRender(ctx,gui);
			}
		}
		postLoad(){
			
		}
		Unload(){
			
		}
	}
	SceneItem.prototype.getId=function(){
		return this.id;
	}
	SceneItem.prototype.onUpdate=function(time){
		for(var i=0;i<this.children.length;i++){
			this.children[i].onUpdate(time);
		}
	}
	SceneItem.prototype.addTag=function(tag){
		if(this.tags.indexOf(tag)==-1){
			this.tags.push(tag);
		}
	}
	
	SceneItem.prototype.removeTag=function(tag){
		let idx=this.tags.indexOf(tag);
		if(idx!==-1){
			this.tags.splice(idx,1);
		}
	}
	
	SceneItem.prototype.containsTag=function(tag){
		for(let i=0;i<this.tags.length;i++){
			if(this.tags[i]==tag){
				return true;
			}
		}
		return false;
	}
	
	SceneItem.prototype.calculateWorldCoordinates=function(){
		if(this.parent!==null){
			var p=this.parent;
			var pwc=p.calculateWorldCoordinates();
			var px=pwc.x;
			var py=pwc.y;
			return {'x':this.x+px,'y':this.y+py};
		}
		return {'x':this.x,'y':this.y};
	}
	
	/* SceneItem.prototype.onAssetsLoaded=function(){
		let event=jQuery.Event("AssetLoaded");
		event.target=this;
		$(document).trigger(event);
	} */
	
	window.SceneItem=SceneItem;
	
	class Interactable extends SceneItem{
		constructor(params){
			super(params);
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
		}
		interact(caller){
		}
		proximity(caller){
		}
	}
	window.Interactable=Interactable;
	
	class SceneManager{
		constructor(){
			this.tickTime=16;
			this.lastUpdate=0;
			this.items=[];
		}
		postLoad(){
			for(let i=0;i<this.items.length;i++){
				this.items[i].postLoad();
			}
		}
	}
	
	SceneManager.prototype.append=function(item){
		this.items.push(item);
		this.sort();
	}
	
	SceneManager.prototype.onRender=function(ctx){
		var canvas=window.canvas.getCanvas();
		let c=window.Camera;
		ctx.translate(Math.floor(-c.centerx+(canvas.width/2)),Math.floor(-c.centery+(canvas.height/2)));
		let inWorldScene=window.currentScene.getSceneProperty('worldscene');
		for(var i=0;i<this.items.length;i++){
			let item=this.items[i];
			if(inWorldScene){
				if(this.isInViewport(item)){
					this.items[i].onRender(ctx);
				}
			}else{ 
				this.items[i].onRender(ctx);
			}
		}
		ctx.setTransform(1,0,0,1,0,0);

	}
	
	SceneManager.prototype.onUpdate=function(time){
		if(time-this.lastUpdate>this.tickTime){
			for(var i=0;i<this.items.length;i++){
				this.items[i].onUpdate(time);
			}
			this.lastUpdate=time;
		}
		window.Camera.onUpdate(time);
	}
	SceneManager.prototype.getItemsByType=function(type){
		let ret=[];
		for(let i=0;i<this.items.length;i++){
			if(this.items[i] instanceof type){
				ret.push(this.items[i]);
			}
		}
		return ret;
	}
	SceneManager.prototype.isInViewport=function(item){
		var canvas=window.canvas.getCanvas();
		let c=window.Camera;
		let x=item.x;
		let y=item.y;
		let halfW=canvas.width/1.5;
		let halfH=canvas.height/1.5;
		if(x>c.centerx-halfW&&x<c.centerx+halfW){
			if(y>=c.centery-halfH&&y<c.centery+halfH){
				return true;
			}
		}
		return false;
	}
	SceneManager.prototype.getItemById=function(id){
		for(let i=0;i<this.items.length;i++){
			let item=this.items[i];
			if(item.getId()==id){
				return item;
			}
		}
		return null;
	}
	SceneManager.prototype.sort=function(){
		this.items.sort(function(a,b){
			var al=a.layer;
			var bl=b.layer;
			if(al<bl){
				return -1;
			}
			if(al>bl){
				return 1;
			}
			return 0;
		});
	}
	SceneManager.prototype.getItemsByTags=function(tags){
		let tmp=this.items;
		for(let i=0;i<tags.length;i++){
			let tag=tags[i];
			for(let j=0;j<tmp.length;j++){
				if(!tmp[i].containsTag(tag)){
					tmp.splice(j,1);
					j--;
				}
			}
		}
		return tmp;
	}
	SceneManager.prototype.Unload=function(){
		for(let i=0;i<this.items.length;i++){
			if(this.items[i].Unload){
				this.items[i].Unload();
			}
			this.items[i]=null;
		}
		this.items.length=0;
	}
	
	window.SceneManager=new SceneManager();
	
	class Camera{
		constructor(params){
			this.centerx=0;
			this.centery=0;
			this.target=null;
		}
	}
	Camera.prototype.setTarget=function(target){
		this.target=target;
	}
	Camera.prototype.onUpdate=function(time){
		if(!this.target){return;}
		this.centerx=this.target.x;
		this.centery=this.target.y;
		
		let c=window.canvas.getCanvas();
		if(this.centerx<=c.width/2){
			this.centerx=c.width/2;
		}
		if(this.centery<=c.height/2){
			this.centery=c.height/2;
		}
	}
	window.Camera=new Camera();
	
})();