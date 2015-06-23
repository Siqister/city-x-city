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

	vent.on('parcel:update',function(){
		console.log('parcelsCollection:fetch');
		parcelsCollection.fetch();
	})

	return parcelsCollection;
})