"use strict";

(function(){
	
	class Session{
		constructor(){
			this.key=null;
		}
		setItem(key,value){
			sessionStorage.setItem(key,value);
		}
		getItem(key){
			return sessionStorage.getItem(key);
			/* $.getJSON(key,function(data){
				
			}); */
		}
		getItemA(key,callback){
			let ret=sessionStorage.getItem(key);
			callback(ret);
		}
		hasItem(key){
			return sessionStorage.getItem(key)!==null;
		}
		removeItem(key){
			sessionStorage.removeItem(key);
		}
	}
	
	window.Session=new Session();
	
})();