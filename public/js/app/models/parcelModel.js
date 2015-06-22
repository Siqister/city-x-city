define([
	'backbone'
],function(
	Backbone
){
	var ParcelModel = Backbone.Model.extend({
		urlRoot:'parcel', //do not share the same api endpoint as collection
		idAttribute:'cartodb_id',
		parse:function(res){
			return res.features[0].properties; //doesn't contain geom information
		}
	});

	return ParcelModel;
})