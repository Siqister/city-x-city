define([
	'backbone'
],function(
	Backbone
){
	var ParcelModel = Backbone.Model.extend({
		urlRoot:'parcel', //do not share the same api endpoint as collection
		idAttribute:'cartodb_id'
	});

	return ParcelModel;
})