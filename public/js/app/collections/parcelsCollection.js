define([
	'backbone',
	'app/models/parcelModel',

	'vent'
],function(
	Backbone,
	ParcelModel,

	vent
){
	var ParcelsCollection = Backbone.Collection.extend({
		url:'/parcel',
		model:ParcelModel
	});

	var parcelsCollection = new ParcelsCollection();

	vent.on('parcel:update',function(){
		console.log('parcelsCollection:fetch');
		parcelsCollection.fetch();
	})

	return parcelsCollection;
})