define([
	'marionette',

	'vent',

	'app/views/mapView',
	'app/views/parcelView',
],function(
	Marionette,

	vent,

	mapView,
	ParcelView
){
	var AppLayoutView = Marionette.LayoutView.extend({
		el:'body', //render view without template
		template:false,

		regions:{
			top:".top",
			detail:'.content .detail',
			map:'.content .map',
			viz:'.content .viz'
		},

		onRender:function(){
			console.log('appLayoutView:render');

			this.map.show(mapView);
		}
	});

	var appLayoutView = new AppLayoutView();

	vent.on('parcel:detail:show',function(model){
		appLayoutView.detail.show(new ParcelView({model:model}));
	})

	return appLayoutView;
})