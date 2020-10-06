"use strict";

(function(){

	
	const DEFAULT_FRAME_DURATION=33;
	class AnimationFrame{
		constructor(params){
			this.sx=params.x;
			this.sy=params.y;
			this.sw=params.w;
			this.sh=params.h;
			this.duration=params.duration==undefined?DEFAULT_FRAME_DURATION:params.duration;
		}
	}
	
	class Animation{
		constructor(params){
			this.frames=[];
			this.name=params.name;
			let fr=params.frames;
			for(var i=0;i<fr.length;i++){
				this.frames.push(new AnimationFrame(fr[i]));
			}
		}
	}
	
	class SpriteCache{
		
		constructor(){
			this.cache={};
		}
		Load(params){
			let src=params.src;
			if(src===undefined){return null;}
			if(this.cache.hasOwnProperty(src)==-1){
				let ns=new Sprite();
				ns.Load(params);
				this.cache[src]=ns;
				return ns;
			}else{
				return this.cache[src];
			}
		}
	}
	window.SpriteCache=new SpriteCache();
	
	class SpriteAnimation extends SceneItem{
		constructor(params){
			super(params);
			this.animationData=null;
			this.animsrc="";
			this.animations=[];
			this.spritemap=new window.Sprite();
			this.loaded=false;
			this.currentFrame=0;
			this.currentAnimation=0;
			this.lastUpdate=0;
			this.type="Animation";
			this.stopAtEndOfAnimation=false;
			this.eventListeners={};
			
			/* if(params.src!==undefined){
				this.animsrc=params.src;
				this.Load(params.src);
			} */
			//SceneManager.add(this);
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
			this.animsrc=params.animsrc;
			
			this.Load(this.animsrc);
		}
		getCurrentFrame(){
			if(this.loaded==false){return false;}
			return this.animations[this.currentAnimation].frames[this.currentFrame];
		}
		getNumAnimations(){
			return this.animations.length;
		}
		getAnimationNames(){
			let ret=[];
			for(let i=0;i<this.getNumAnimations();i++){
				ret.push(this.animations[i].name);
			}
			return ret;
		}
		setRandomAnimation(stop){
			let names=this.getAnimationNames();
			let max=names.length;
			this.setAnimation(names[Math.floor(Math.random()*max)],stop);
		}
	}
	
	
	SpriteAnimation.prototype.Load=function(p_Src){
		$.getJSON(p_Src,{},function(p_Data){
			this.animationData=p_Data;
			this.currentFrame=0;
			this.currentAnimation=0;
			
			this.spritemap.Load({'src':this.animationData.spritesrc,'success':function(){
				this.loaded=true;
				this.fireEvent("animation_loaded");
			}.bind(this)});
			
			let animations=this.animationData.animations;
			for(var j=0;j<animations.length;j++){
				this.animations.push(new Animation(animations[j]));
			}
		}.bind(this));
	}
	
	SpriteAnimation.prototype.setAnimation=function(name,stop){
		for(var i=0;i<this.animations.length;i++){
			if(this.animations[i].name==name&&this.currentAnimation!=i){
				this.currentAnimation=i;
				this.currentFrame=0;
				this.stopAtEndOfAnimation=stop;
				return;
			}
		}
	}
	
	SpriteAnimation.prototype.onUpdate=function(time){
		if(this.loaded==false){return;}
		let delta=time-this.lastUpdate;
		let currentAnimation=this.animations[this.currentAnimation];
		let currentFrame=currentAnimation.frames[this.currentFrame];
		let frameDuration=currentFrame.duration;
		if(delta>frameDuration){
			this.currentFrame++;
			if(this.currentFrame>=currentAnimation.frames.length){
				this.fireEvent("end_of_animation");
				this.currentFrame=this.stopAtEndOfAnimation?this.currentFrame-1:0;
			}
			this.lastUpdate=time;
		}
	}
	SpriteAnimation.prototype.registerEventlistener=function(event,callback){
		if(!this.eventListeners.hasOwnProperty(event)){
			this.eventListeners[event]=[callback];
		}else{
			this.eventListeners[event].push(callback);
		}
	}
	
	SpriteAnimation.prototype.fireEvent=function(event){
		if(this.eventListeners.hasOwnProperty(event)){
			for(let i=0;i<this.eventListeners[event].length;i++){
				let ret=this.eventListeners[event][i]();
				if(ret===false){
					this.eventListeners[event].splice(i,1);
				}
			}
		}
	}
	
	SpriteAnimation.prototype.onRender=function(ctx){
		if(this.loaded==false){return;}
		let wc=this.calculateWorldCoordinates();
		let currentAnimation=this.animations[this.currentAnimation];
		let img=this.spritemap.Image();
		let frames=currentAnimation.frames;
		
		let f=frames[this.currentFrame];
		ctx.drawImage(img,f.sx,f.sy,f.sw,f.sh,wc.x,wc.y,f.sw,f.sh);
		
	}
	
	SpriteAnimation.prototype.onSpriteLoad=function(img){
		
	}
	
	
	window.SpriteAnimation=SpriteAnimation;
	
})();