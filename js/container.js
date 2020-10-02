"use strict";

(function(){
	//const CONTAINER_KEY="visited_container";
	class Container extends Interactable{
		constructor(params){
			super(params);
			this.activeDialog=null;
			this.playerHandle=null;
			this.hasVisited=false;
			this.loaded=false;
			this.dialogCloseDelay=1000;
		}
		loadFromProperties(params){
			super.loadFromProperties(params);
			this.id=params.id===undefined?"noid":params.id;
			let itemRef=params.item===undefined?null:params.item;

			$.getJSON(itemRef,function(data){
				this.item=data;
				this.readVisited();
				this.loaded=true;
			}.bind(this));

			$(document).on(`keydown.CONTAINER`,this.onKeydown.bind(this));
		}
		readVisited(callback){
			this.getSessionEntry(function(entry){
				if(entry!==null){
					this.hasVisited=entry.visited;
					if(callback!==undefined){
						callback();
					}
				}
				else{
					this.setVisited(false);
				}
			}.bind(this));
		}
		setVisited(visited){
			window.Session.getItemA(CONTAINER_KEY,function(ret){
				let data=JSON.parse(ret);
				let found=false;
				for(let i=0;i<data.length;i++){
					if(data[i].id==this.id){
						data[i].visited=visited;
						found=true;
					}
				}
				if(!found){
					data.push({'id':this.id,'visited':visited});
				}
				window.Session.setItem(CONTAINER_KEY,JSON.stringify(data));
			}.bind(this));
		}
		onKeydown(event){
			if(event.which==window.INTERACT_KEY){
				if(distanceTo(this.playerHandle,this)<window.INTERACTABLE_INTERACT_DISTANCE){
					this.removeDialog();
					this.interact();
				}
			}
		}
		postLoad(){
			this.playerHandle=SceneManager.getItemById('player');
			let tilemap=SceneManager.getItemById('tilemap');
			if(!tilemap){return;}
			tilemap.registerEventListener('tilemap_loaded',function(tm){
				let tile=tm.getTileByCoord(this.x,this.y);
				if(tile==null){return;}
				tile.setIndex(15);
				tm.calculateNeighbors();
			}.bind(this));
		}
		
		getSessionEntry(callback){
			window.Session.getItemA(CONTAINER_KEY,function(ret){
				if(ret!==undefined){
					let data=JSON.parse(ret);
					for(let i=0;i<data.length;i++){
						if(data[i].id==this.id){
							callback(data[i]);
							return;
						}
					}
				}
				callback(null);
			}.bind(this));	
		}
		onRender(ctx){
			if(!this.loaded){return;}
			
			if(this.activeDialog){
				this.activeDialog.onRender(ctx);
			}
			
			super.onRender(ctx);
		}
		onUpdate(time){
			if(!this.loaded){return;}
			
			if(this.activeDialog){
				this.activeDialog.onUpdate(time);
				if(this.activeDialog.shouldClose()||this.activeDialog.isDone()){
					setTimeout(function(){this.removeDialog();}.bind(this),this.dialogCloseDelay);
				}
			}
			
			super.onUpdate(time);
		}
		interact(caller){
			this.readVisited(function(){
				if(!this.hasVisited){
					this.addItemtoInventory(this.item);
				}
			}.bind(this));
		}
		addItemtoInventory(item){
			window.Session.getItemA(window.INVENTORY_STATS_KEY,function(ret){
				let data=JSON.parse(ret);
				data.push(item);
				window.Session.setItem(window.INVENTORY_STATS_KEY,JSON.stringify(data));
				this.setVisited(true);
				this.createDialog(`You found a: ${item.name}`);
			}.bind(this));
		}
		createDialog(text){
			let wc=this.calculateWorldCoordinates();
			let dialogBox=new DialogWidget({'x':wc.x,
				'y':wc.y,
				'w':175,
				'h':100,
				'scrollspeed':50,
				'gradient':{
					'start':'#0A1638',
					'end':'#122968'
				},
				'border':'#eee',
				'text':text,
				'layer':100});
			dialogBox.y=wc.y-(dialogBox.h+DIALOG_PADDING);
			this.activeDialog=dialogBox;
		}
		removeDialog(){
			if(this.activeDialog){
				this.activeDialog.Unload();
			}
			this.activeDialog=false;
			this.proximityLifespan=false;
		}
	}
	window.Container=Container;
	
	
})();