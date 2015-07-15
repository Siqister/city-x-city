define([
	'marionette',
	'underscore',

	'vent',

	'text!app/templates/headerView.html'
],function(
	Marionette,
	_,

	vent,

	headerViewTemplate
){
	var HeaderView = Marionette.ItemView.extend({
		className:'header-inner',
		template:_.template(headerViewTemplate),
		ui:{
			'mapView':'.btn-map',
			'gridView':'.btn-grid'
		},
		events:{
			'click @ui.mapView':function(){
				vent.trigger('ui:show:map');
			},
			'click @ui.gridView':function(){
				vent.trigger('ui:show:grid');
				vent.trigger('cityCollectionView:expand');
			}
		}
	});

	return new HeaderView();
})