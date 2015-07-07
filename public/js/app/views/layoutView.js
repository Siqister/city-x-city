define([
	'marionette',

	'vent',

	'app/views/mapView',
	'app/views/parcelView',
	'app/views/cityCollectionView',
	'app/views/editView'
],function(
	Marionette,

	vent,

	mapView,
	ParcelView,
	cityCollectionView,
	EditView
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
			edit:'.content .edit'
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
	vent.on('edit:show',function(model){
		appLayoutView.edit.show(new EditView({model:model}));
	})

	return appLayoutView;
})