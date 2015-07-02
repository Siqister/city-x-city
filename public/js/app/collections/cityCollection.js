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
		vent.trigger('cityCollection:update',this);
	});
	cityCollection.on('sync',function(){
		console.log('cityCollection:update');
	});

	return cityCollection;
})