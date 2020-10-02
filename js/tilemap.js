"use strict";

(function(){
	const TILE_WIDTH=32;
	const TILE_HEIGHT=32;
	class Tile extends SceneItem{
		constructor(img,x,y,index,variation){
			super({'x':x*TILE_WIDTH,'y':y*TILE_HEIGHT,'w':TILE_WIDTH,'h':TILE_HEIGHT,'layer':0});
			this.index=index;
			this.variation=variation;
			this.img=img;
			this.selected=true;
			this.topleft=null;
			this.top=null;
			this.topright=null;
			this.left=null;
			this.right=null;
			this.bottomleft=null;
			this.bottom=null;
			this.bottomright=null;
		}
		Unload(){
			this.img=null;
			
			super.Unload();
		}
	}
	
	
	
/* 	Tile.prototype.onClick=function(event){
		let c=window.Camera;
		let canvas=window.canvas.getCanvas();
		let clientX=event.clientX+(c.centerx-canvas.width/2);
		let clientY=event.clientY+(c.centery-canvas.height/2);
		let tx=this.x;
		let ty=this.y;
		if(clientX>=tx&&clientX<tx+this.w){
			if(clientY>=ty&&clientY<ty+this.h){
				this.selected=true;
			}
		}
	} */
	
	Tile.prototype.onRender=function(ctx){
		if(this.norender){return;}
		let img=this.img;
		let x=this.x;
		let y=this.y;
		let w=this.w;
		let h=this.h;
		let index=this.index;
		let variation=this.variation;
		
		if(this.img!==null){
			ctx.drawImage(img,w*index,variation*h,w,h,x,y,w,h);
		}
		
		if(this.selected&&this.index!=15){
			ctx.strokeStyle="#f33";
			ctx.lineWidth=2;
			let neighbors=[this.topleft,this.top,this.topright,this.right,this.bottomright,this.bottom,this.bottomleft,this.left];
			for(let i=0;i<neighbors.length;i++){
				let n=neighbors[i];
				if(n==null&&n==undefined){continue;}
				if(n.index==15){continue;}
				ctx.beginPath();
				ctx.moveTo(x+w/2,y+h/2);
				ctx.lineTo(n.x+n.w/2,n.y+n.h/2);
				ctx.stroke();
			}
		}
	}
	Tile.prototype.getNeighbors=function(){
		return [this.left,this.topleft,this.top,this.topright,this.right,this.bottomright,this.bottom,this.bottomleft];
	}
	Tile.prototype.getIndex=function(){
		return this.index;
	}
	Tile.prototype.setIndex=function(index){
		this.index=index;
	}
	
	function isFilled(data,idx){
		return (data[idx]==0&&data[idx+1]==0&&data[idx+2]==0)&&data[idx+3];
	}
	
	class Tilemap extends SceneItem{
		constructor(p_Params){
			super(p_Params);
			this.spriteloaded=0;
			this.tiles=[];
			this.row=0;
			this.id="";
			this.bitmapdata=null;
			this.bitmapsrc=null;
			this.spritesrc=null;
			this.sprite=null;
		}
		
		loadFromProperties(p_properties){
			super.loadFromProperties(p_properties);
			this.bitmapsrc=p_properties.bitmapsrc;
			this.spritesrc=p_properties.spritesrc;
			this.id=p_properties.hasOwnProperty("id")?p_properties.id:"";
			
			this.Load();
		}
		
		Unload(){
			for(let i=0;i<this.tiles.length;i++){
				this.tiles[i] = null;
			}
			if(this.sprite!=null){
				this.sprite.Unload();
			}
			this.tiles.length=0;
			this.sprite=null;
			this.bitmapdata=null;
			this.spritesrc=null;
		}
	}
	Tilemap.prototype.Load=function(){
		this.bitmap=new window.Sprite({
				'src':this.bitmapsrc,
				'success':function(img){
					var bm=img.Image();
					var tempCanvas=$('<canvas width="'+bm.width+'" height="'+bm.height+'"></canvas>')[0];
					
					var ctx=tempCanvas.getContext('2d');
					ctx.drawImage(bm,0,0);
					this.bitmapdata=ctx.getImageData(0,0,bm.width,bm.height);
					
					var bd=this.bitmapdata;
					var row=bd.width;
					this.row=row;
					var width=bd.width;
					var height=bd.height;
					var end=width*height;
					
					var data=bd.data;
					var c=0;
					var y=0,x=0;
					for(var i=0;i<bd.width*bd.height*4;i+=4){
						if(c%width==0&&c!=0){
							y++;
							x=0;
						}

						var index=0;
						var current=x+(y*row);
						if(!isFilled(data,current*4)){
							var up=x+((y-1)*row);
							if(up<0||isFilled(data,up*4)){
								index+=1;
							}
							var right=x+1+(y*row);
							if(right<(y+1)*row&&isFilled(data,right*4)){
								index+=2;
							}
							var down=x+((y+1)*row);
							if(down>end||isFilled(data,down*4)){
								index+=4;
							}
							var left=x-1+(y*row);
							if(left<0||left<(y-1)*row||isFilled(data,left*4)){
								index+=8;
							}
						}else{
							index=15;
						}
						var tile=new Tile(this.sprite.Image(),x,y,index,Math.floor(Math.random() * 2));
						this.tiles.push(tile);
						SceneManager.append(tile);
						x++;
						c++;
					}
					this.spriteloaded+=1;
					this.calculateNeighbors();
					SceneManager.sort();
					
				}.bind(this)
			});
			this.sprite=new window.Sprite({
				'src':this.spritesrc,
				'success':function(){this.spriteloaded+=1;}.bind(this)
			});
	}
	Tilemap.prototype.onRender=function(ctx){
		
	}
	Tilemap.prototype.onUpdate=function(time){
		
	}
	Tilemap.prototype.pathTo=function(startTile,endTile){
		let as=new AStar();
		if(startTile.getIndex()==15||endTile.getIndex()==15){return null;}
		return as.path(startTile,endTile);
	}
	Tilemap.prototype.getTilesByIndex=function(index){
		var ret=[];
		for(var i=0;i<this.tiles.length;i++){
			var tile=this.tiles[i];
			if(tile.getIndex()==index){
				ret.push(tile);
			}
		}
		return ret;
	}
	Tilemap.prototype.getTileByCoord=function(x,y){
		for(let i=0;i<this.tiles.length;i++){
			let tile=this.tiles[i];
			if(tile.x<=x&&tile.x+tile.w>x){
				if(tile.y<=y&&tile.y+tile.h>y){
					return tile;
				}
			}
		}
		return null;
	}
	
	Tilemap.prototype.calculateNeighbors=function(){
		let row=this.row;
		let up=-row;
		let down=row;
		let left=-1;
		let right=1;
		let upleft=-row-1;
		let upright=-row+1;
		let downleft=row-1;
		let downright=row+1;
		let tiles=this.tiles;
		for(let i=0;i<tiles.length;i++){
			let tile=tiles[i];
			let currentRow=Math.floor(i/row);
			
			if(i+up>=0){
				tile.top=tiles[i+up];
			}
			if(i+down<tiles.length){
				tile.bottom=tiles[i+down];
			}
			if(i+left>=i-(i%row)){
				tile.left=tiles[i+left];
			}
			if(i+right<(currentRow+1)*row){
				tile.right=tiles[i+right];
			}
			if(i+upleft>=0&&i+upleft>=i-(i%row)-row){
				tile.topleft=tiles[i+upleft];
			}
			if(i+upright>0&&i+upright<row*currentRow){
				tile.topright=tiles[i+upright];
			}
			if(i+downleft<tiles.length&&i+downleft>=row*(currentRow+1)){
				tile.bottomleft=tiles[i+downleft];
			}
			if(i+downright<tiles.length&&i+downright<row*(currentRow+2)){
				tile.bottomright=tiles[i+downright];
			}
		}
	}
	
	window.Tilemap=Tilemap;
	
	class Location extends Tilemap{
		constructor(p_Params){
			super(p_Params);
			this.spriteloaded=0;
			this.tiles=[];
			this.row=0;
			this.id="";
			this.background=null;
			this.backgroundsrc=null;
			this.collisionmap=null;
			this.collisionmapsrc=null;
			this.eventBroadcaster=new EventBroadcaster(this);
		}
		
		loadFromProperties(p_properties){
			//super.loadFromProperties(p_properties);
			this.x=p_properties.x;
			this.y=p_properties.y;
			this.w=p_properties.w;
			this.h=p_properties.h;
			this.layer=p_properties.layer;
			this.backgroundsrc=p_properties.backgroundsrc;
			this.collisionmapsrc=p_properties.collisionmapsrc;
			this.id=p_properties.hasOwnProperty("id")?p_properties.id:"";
			
			this.Load();
		}
		Load=function(){
			if(this.backgroundsrc){
				this.background=new Sprite({'src':this.backgroundsrc,'success':function(img){
					this.spriteloaded++;
				}.bind(this)});
			}
			if(this.collisionmapsrc){
				this.collisionmap=new Sprite({'src':this.collisionmapsrc,'success':function(img){
					this.spriteloaded++;
					this.buildCollisionmap(img);
				}.bind(this)});
			}
		}
		registerEventListener(event,callback){
			this.eventBroadcaster.registerEventListener(event,callback);
		}
		buildCollisionmap(img){
			var bm=img.Image();
			var tempCanvas=$('<canvas width="'+bm.width+'" height="'+bm.height+'"></canvas>')[0];
			
			var ctx=tempCanvas.getContext('2d');
			ctx.drawImage(bm,0,0);
			this.bitmapdata=ctx.getImageData(0,0,bm.width,bm.height);
			
			var bd=this.bitmapdata;
			var row=bd.width;
			this.row=row;
			var width=bd.width;
			var height=bd.height;
			var end=width*height;
			
			var data=bd.data;
			var c=0;
			var y=0,x=0;
			for(var i=0;i<bd.width*bd.height*4;i+=4){
				if(c%width==0&&c!=0){
					y++;
					x=0;
				}

				var index=0;
				var current=x+(y*row);
				if(!isFilled(data,current*4)){
					var up=x+((y-1)*row);
					if(up<0||isFilled(data,up*4)){
						index+=1;
					}
					var right=x+1+(y*row);
					if(right<(y+1)*row&&isFilled(data,right*4)){
						index+=2;
					}
					var down=x+((y+1)*row);
					if(down>end||isFilled(data,down*4)){
						index+=4;
					}
					var left=x-1+(y*row);
					if(left<0||left<(y-1)*row||isFilled(data,left*4)){
						index+=8;
					}
				}else{
					index=15;
				}
				var tile=new Tile(null,x,y,index,0);
				tile.norender=true;
				this.tiles.push(tile);
				SceneManager.append(tile);
				x++;
				c++;
			}
			//this.spriteloaded+=1;
			this.calculateNeighbors();
			SceneManager.sort();
			this.eventBroadcaster.fireEvent('tilemap_loaded');
		}
		
		onRender(ctx){
			if(this.spriteloaded<2){return;}
			
			ctx.drawImage(this.background.Image(),0,0);
			super.onRender(ctx);
		}
	}
	
	window.Location=Location;
})();