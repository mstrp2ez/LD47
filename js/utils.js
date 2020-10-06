"use strict";

function distanceTo(p0,p1){
	let dx=p1.x-p0.x;
	let dy=p1.y-p0.y;
	return Math.sqrt(dx*dx+dy*dy);
}

function rotatedPosition(mx,my,ox,oy,theta){
	let newx=Math.cos(theta) * (mx-ox) - Math.sin(theta) * (my-oy) + ox;
	let newy=Math.sin(theta) * (mx-ox) + Math.cos(theta) * (my-oy) + oy;
	
	return {'x':newx,'y':newy};
}

function normalize(p1,p2){
	let len=Math.sqrt(p1*p1+p2*p2);
	if(len==0){return NaN;}
	let d=1/len;
	return {'x':p1*d,'y':p2*d};
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