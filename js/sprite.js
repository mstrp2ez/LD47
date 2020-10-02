"use strict";

(function(){

	class Sprite extends SceneItem{
		constructor(p_Params){
			super(p_Params);
			this.image=new Image();
			this.loaded=false;
			
			if(p_Params!==undefined&&p_Params!==null){
				this.Load(p_Params);
			}
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
			
			this.Load(params);
		}
		onRender(ctx){
			ctx.drawImage(this.image,this.x,this.y);
		}
		Load(params){
			this.image.onload=function(){
				this.onLoad();
				if(p_Params.success){
					p_Params.success(this);
				}
			}.bind(this);
			this.image.src=p_Params.src;
		}
		Image(){
			return this.image;
		}
		onLoad(){
			this.loaded=true;
		}
		Unload(){
			this.image.onload=null;
			this.image=null;
		}
	}

	window.Sprite=Sprite;
})();