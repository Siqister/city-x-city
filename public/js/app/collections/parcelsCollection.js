define([
	'backbone',

	'vent'
],function(
	Backbone,

	vent
){
	var ParcelsCollection = Backbone.Collection.extend({
		url:'/parcels',

		parse:function(res){
			return res.features;
		}
	});

	var parcelsCollection = new ParcelsCollection();

	return parcelsCollection;
})