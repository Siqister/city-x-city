define([
	'backbone'
],function(
	Backbone
){
	var ParcelModel = Backbone.Model.extend({
		idAttribute:'cartodb_id'
	});

	return ParcelModel;
})