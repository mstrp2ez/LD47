"use strict";

function distanceTo(p0,p1){
	let dx=p1.x-p0.x;
	let dy=p1.y-p0.y;
	return Math.sqrt(dx*dx+dy*dy);
}

class EventBroadcaster{
	constructor(owner){
		this.eventListeners={};
		this.owner=owner;
	}
	registerEventListener(event,callback){
		if(this.eventListeners.hasOwnProperty(event)){
			this.eventListeners[event].push(callback);
		}else{
			this.eventListeners[event]=[callback];
		}
	}
	fireEvent(event){
		if(this.eventListeners.hasOwnProperty(event)){
			for(let i=0;i<this.eventListeners[event].length;i++){
				this.eventListeners[event][i](this.owner);
			}
		}
	}
	Unload(){
		this.eventListeners=null;
		this.owner=null;
	}
}