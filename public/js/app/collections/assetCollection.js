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
		model:AssetModel,
    filterByActivating: function () {
    	console.log("filter by byActivating");
      var filtered = this.filter(function (asset) {
          return asset.get("byActivating") === true;
      });
      return new AssetCollection(filtered);
      this.trigger("sync");
    }
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
	// assetCollection.on("assetCollection:filterByActivating", assetCollection.filterByActivating);

	return assetCollection;
})