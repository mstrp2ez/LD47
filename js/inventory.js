"use strict";

(function(){
	
	
	class Inventory{
		constructor(){
			this.session=window.Session;
		}
		getInventory(){
			let invJson=this.session.getItem(INVENTORY_KEY);
			return JSON.parse(invJson);
		}
		addItem(item){
			let inv=this.getInventory();
			inv.push(item);
			this.saveInventory(inv);
		}
		removeItem(item,count){
			let inv=this.getInventory();
			let removed=0;
			for(let i=0;i<inv.length;i++){
				if(inv[i].name==item.name){
					inv.splice(i,1);
					removed++;
					if(removed>=count){
						break;
					}
				}
			}
			this.saveInventory(inv);
		}
		sortInventory(){
			let inv=this.getInventory();
			inv.sort(function(a,b){
				if(a.name>b.name){
					return 1;
				}
				if(a.name<b.name){
					return -1;
				}
				return 0;
			});
			this.saveInventory(inv);
		}
		saveInventory(inv){
			this.session.setItem(INVENTORY_KEY,JSON.stringify(inv));
		}
	}
	
	window.Inventory=Inventory;
	
})();