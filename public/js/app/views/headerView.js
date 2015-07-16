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
			'gridView':'.btn-grid',
			'allBtn':'.custom-btn'
		},
		events:{
			'click @ui.mapView':function(){
				//vent.trigger('ui:show:map');
				vent.trigger('cityCollectionView:collapse');
				this.ui.allBtn.removeClass('active');
				this.ui.mapView.addClass('active');

			},
			'click @ui.gridView':function(){
				//vent.trigger('ui:show:grid');
				vent.trigger('cityCollectionView:expand');
				this.ui.allBtn.removeClass('active');
				this.ui.gridView.addClass('active');
			}
		}
	});

	return new HeaderView();
})