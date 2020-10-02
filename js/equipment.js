"use strict";

(function(){
	
	const PLAYER_KEY_KEY="player_keys";
	const PLAYER_STATS_KEY="player_party";
	class Equipment{
		constructor(){
			
		}
		equipItem(playerKey,item){
			if(item.type=='consumable'){
				this.consumeItem(playerKey,item);
				return;
			}
			let playerName=this.findPlayerNameByKey(playerKey)
			if(playerName==false){return false;}
			let playerStats=JSON.parse(window.Session.getItem(PLAYER_STATS_KEY));
			
			let player=null;
			for(let i=0;i<playerStats.length;i++){
				if(playerStats[i].name==playerName){
					player=playerStats[i];
					break;
				}
			}
			if(player==null){console.log(`Tried to equip item to invalid player: ${playerName}`);return;}
			
			if(!this.isItemEquiped(player.items,item)){
				player.items.length=0;
				player.items.push(item);
				window.Session.setItem(PLAYER_STATS_KEY,JSON.stringify(playerStats));
				
				return true;
			}
			return false;
		}
		consumeItem(playerKey,item){
			if(item.type!=='consumable'){
				this.equipItem(playerKey,item);
				return;
			}
			let player=this.findPlayerNameByKey(playerKey);
			let consumable=new window.Consumable(item);
			consumable.useOn(player);
		}
		isItemEquiped(equipment,item){
			for(let i=0;i<equipment.length;i++){
				if(equipment[i].name==item.name){
					return true;
				}
			}
			return false;
		}
		getEquipment(playerName){
			let playerStats=JSON.parse(window.Session.getItem(PLAYER_STATS_KEY));
			for(let i=0;i<playerStats.length;i++){
				if(playerStats[i].name==playerName){
					return playerStats[i].items;
				}
			}
			return null;
		}
		findPlayerNameByKey(playerKey){
			let playerParty=window.Session.getItem(PLAYER_KEY_KEY);
			playerParty=JSON.parse(playerParty);
			for(let i=0;i<playerParty.length;i++){
				if(playerParty[i].key===playerKey){
					return playerParty[i].name;
				}
			}
			return false;
		}
		findPlayerByName(playerName){
			
		}
	}
	window.Equipment=new Equipment();
	
})();