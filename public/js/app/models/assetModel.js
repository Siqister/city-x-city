define([
	'backbone'
],function(
	Backbone
){
	var AssetModel = Backbone.Model.extend({
		urlRoot:'/asset',
		defaults:{
			type:'Asset'
		}
	})
	
	return AssetModel;
})