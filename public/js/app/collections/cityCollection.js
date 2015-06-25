define([
	'backbone',

	'vent'
],function(
	Backbone,

	vent
){
	var CityCollection = Backbone.Collection.extend({
		url:'/city'
	});

	var cityCollection = new CityCollection();

	cityCollection.on('sync',function(){
		vent.trigger('cityCollection:update',this);
	})

	return cityCollection;
})