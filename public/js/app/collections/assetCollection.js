define([
	'backbone',

	'vent',

	'app/models/assetModel'
],function(
	Backbone,

	vent,

	AssetModel
){
	var AssetCollection = Backbone.Collection.extend({
		url:'/asset',
		model:AssetModel
	});

	var assetCollection = new AssetCollection();

	vent.on('assetCollection:add',function(model){
		assetCollection.add(model);
	})
	vent.on('assetCollection:remove',function(model){
		assetCollection.remove(model);
		console.log(assetCollection);
	})
	assetCollection.on('sync',function(){
		vent.trigger('assetCollection:sync');
	})
	assetCollection.on('destroy',function(){
		console.log('heard ya');
		vent.trigger('assetCollection:sync');
	})

	return assetCollection;
})