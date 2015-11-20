define([
	'marionette',
	'underscore',

	'vent',

	'text!app/templates/headerView.html',

	'app/views/mapLayerControlView'
],function(
	Marionette,
	_,

	vent,

	headerViewTemplate,

	MapLayerControlView
){
	var HeaderView = Marionette.LayoutView.extend({
		className:'header-inner',
		template:_.template(headerViewTemplate),
		ui:{
			'mapView':'.btn-map',
			'gridView':'.btn-grid',
			'allBtn':'.custom-btn'
		},
		onShow:function(){
			this.mapLayerControl.show(new MapLayerControlView());
		},
		regions:{
			mapLayerControl:'.map-layer-control'
		},
		events:{
			'click @ui.mapView':function(){
				//vent.trigger('ui:show:map');
				vent.trigger('cityCollectionView:collapse');
				this.ui.allBtn.removeClass('active');
				this.ui.mapView.addClass('active');
				
				//Show mapLayerControl submenu
				this.mapLayerControl.show(new MapLayerControlView());
			},
			'click @ui.gridView':function(){
				//vent.trigger('ui:show:grid');
				vent.trigger('cityCollectionView:expand');
				this.ui.allBtn.removeClass('active');
				this.ui.gridView.addClass('active');

				this.mapLayerControl.empty();
			}
		},

		onRender:function(){
		}
	});

	return new HeaderView();
})