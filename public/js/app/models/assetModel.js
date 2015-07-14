define([
	'backbone'
],function(
	Backbone
){
	var AssetModel = Backbone.Model.extend({
		urlRoot:'/asset',
		idAttribute:'cartodb_id',
		defaults:{
			type:'asset'
		}
	})
	
	return AssetModel;
});