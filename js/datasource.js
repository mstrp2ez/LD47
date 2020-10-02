"use strict";

(function(){
	
	class DataSource{
		constructor(dataKey){
			this.dataKey=dataKey;
			this.data=null;
		}
		list(){
			return this.data;
		}
	}
	
	
	class LocalStorageDataSource extends DataSource{
		constructor(dataKey){
			super(dataKey);
			
			this.data=window.Session.getItem(dataKey);
			this.data=JSON.parse(this.data);
			this.data.sort();
		}
		list(){
			return this.data;
		}
	}
	
	window.LocalStorageDataSource=LocalStorageDataSource;
	
})();