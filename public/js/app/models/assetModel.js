define([
	'backbone'
],function(
	Backbone
){
	var AssetModel = Backbone.Model.extend({
		urlRoot:'/asset',
		idAttribute:'cartodb_id',
		defaults:{
			type:'asset',
			assetType:'anchor business'
		},
		validate:function(attr,options){
			var errors = [];

			if(!attr.name){
				errors.push({
					errorCode:2,
					errorField:'name',
					errorMsg:"A name is required."
				})
			}

			if(errors.length>0){return errors;}
		}
	})
	
	return AssetModel;
});