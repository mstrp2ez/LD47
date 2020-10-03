"use strict";

(function(){
	
	class Monster extends RotatorAnimation{
		constructor(){
			super();
			
		}

		onUpdate(time){
			super.onUpdate(time);
			/* let theta=this.rotation*Math.PI / 180;
			let ox=this.x+this.offsetx;
			let oy=this.y+this.offsety;
			
			let newx=Math.cos(theta) * (this.x-ox) - Math.sin(theta) * (this.y-oy) + ox;
			let newy=Math.sin(theta) * (this.x-ox) + Math.cos(theta) * (this.y-oy) + oy; */
			

		}
		onDamageTaken(actor){
			
		}
		isDead(){
			return this.dead;
		}
	}
	window.Monster=Monster;
	
})();