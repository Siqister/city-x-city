define([
	'marionette',

	'vent',

	'app/views/mapView',
	'app/views/parcelView',
	'app/views/cityCollectionView',
],function(
	Marionette,

	vent,

	mapView,
	ParcelView,
	cityCollectionView
){

	console.log(cityCollectionView);
	var AppLayoutView = Marionette.LayoutView.extend({
		el:'body', //render view without template
		template:false,

		regions:{
			top:".top",
			detail:'.content .detail',
			map:'.content .map',
			viz:'.content .viz',
			city:'.content .city',
			parcels:'.content .parcels'
		},

		onRender:function(){
			console.log('appLayoutView:render');

			this.map.show(mapView);
			this.city.show(cityCollectionView);
		}
	});

	var appLayoutView = new AppLayoutView();

	vent.on('parcel:detail:show',function(model){
		appLayoutView.detail.show(new ParcelView({model:model}));
	})

	return appLayoutView;
})