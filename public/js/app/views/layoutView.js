define([
	'marionette',

	'app/views/mapView'
],function(
	Marionette,

	mapView
){
	var AppLayoutView = Marionette.LayoutView.extend({
		el:'body', //render view without template
		template:false,

		regions:{
			top:".top",
			map:'.content .map',
			viz:'.content .viz'
		},

		onRender:function(){
			console.log('appLayoutView:render');

			this.map.show(mapView);
		}
	});

	return new AppLayoutView();
})