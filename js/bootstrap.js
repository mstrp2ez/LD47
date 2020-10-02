"use strict";

(function(){
	class Bootstrap{
		constructor(){
			var scene=new window.Scene();
			
			let currentScene=sessionStorage.getItem("current_scene");
			let sceneSrc='assets/scenes/scene0.json';
			if(currentScene!==null){
				sceneSrc=currentScene;
			}
			
			scene.loadScene(sceneSrc);
		}
	}
	
	window.Bootstrap=Bootstrap;
})();