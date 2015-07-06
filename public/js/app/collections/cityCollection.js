define([
	'backbone',

	'vent'
],function(
	Backbone,

	vent
){
	var CityModel = Backbone.Model.extend({
		url:'/city',
		idAttribute:'city'
	});

	var CityCollection = Backbone.Collection.extend({
		url:'/city',
		model:CityModel
	});

	var cityCollection = new CityCollection();

	cityCollection.on('reset',function(){
		console.log('cityCollection:reset');
		vent.trigger('cityCollection:update',this); //trips cityCollectionView.render
	});
	cityCollection.on('sync',function(){
		console.log('cityCollection:update');
	});
	vent.on('parcel:update',function(){
		cityCollection.fetch();
	})

	return cityCollection;
})