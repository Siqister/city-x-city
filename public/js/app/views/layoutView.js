define([
	'marionette',

	'vent',

	'app/views/mapView',
	'app/views/parcelView',
	'app/views/cityCollectionView',
	'app/views/editView',
	'app/views/assetView',
	'app/views/investmentView'
],function(
	Marionette,

	vent,

	mapView,
	ParcelView,
	cityCollectionView,
	EditView,
	AssetView,
	InvestmentView
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
	vent.on('asset:detail:show',function(model){
		appLayoutView.detail.show(new AssetView({model:model}));
	})
	vent.on('investment:detail:show',function(model){
		appLayoutView.detail.show(new InvestmentView({model:model}));
	})
	vent.on('ui:detail:hide:animationComplete',function(){
		appLayoutView.detail.empty();
	})
	vent.on('edit:show',function(model){
		appLayoutView.edit.show(new EditView({model:model}));
	})
	vent.on('edit:cancel',function(){
		appLayoutView.edit.empty();
	})

	return appLayoutView;
})