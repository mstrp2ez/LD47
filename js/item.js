"use strict";

(function(){
	
	
	class Item extends SceneItem {
		constructor(params){
			super(params);
		}
		onRender(ctx){
			
		}
	}
	window.Item=Item;
	
	
	class Weapon extends Item{
		constructor(params,callback){
			super(params);
			this.name=params.name;
			this.value=params.value;
			this.ref=params.ref;
			this.min=0;
			this.max=0;
			this.type="";
			
			this.loadStatsFromRef(callback);
		}
		loadStatsFromRef(callback){
			$.getJSON(this.ref,{},function(p_json){
				this.min=p_json.min;
				this.max=p_json.max;
				this.type=p_json.type;				
				callback(this);
			}.bind(this));
		}
		Serialize(obj){
			obj.name=this.name;
			obj.value=this.value;
			obj.ref=this.ref;
			obj.min=this.min;
			obj.max=this.max;
			obj.type=this.type;
			
			return obj;
		}
	}
	
	window.Weapon=Weapon;
	
	class Consumable extends Item{
		constructor(params){
			super(params);
			this.name=params.name;
			this.target=params.target;
			this.value=params.value;
		}
		useOn(playerKey){
			window.getPartyCharacterFromNameA(playerKey,function(player,party){
				window.Session.getItemA(window.INVENTORY_KEY,function(ret){
					let data=JSON.parse(ret);
					let idx=-1;
					for(let i=0;i<data.length;i++){
						if(data[i].name==this.name){
							idx=i;
							break;
						}
					}
				
					if(idx!=-1){
						player[this.target]+=this.value;
						window.Session.setItem(window.PLAYER_STATS_KEY,JSON.stringify(party));
						data.splice(idx,1);
						window.Session.setItem(window.INVENTORY_KEY,JSON.stringify(data));
					}
				}.bind(this));
			}.bind(this));
		}
	}
	window.Consumable=Consumable;
	
})();