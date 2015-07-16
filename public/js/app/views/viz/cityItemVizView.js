define([
	'marionette',
	'underscore',

	'app/views/viz/landUseChartView'
],function(
	Marionette,
	_,

	LandUseChartView
){
	var templateString = '<div class="viz land-use"></div>'
		+ '<div class="viz parcel-size"></div>'
		+ '<div class="viz placeholder"></div>';

	//this is the master controller for which visualizations to display
	var CityItemVizView = Marionette.LayoutView.extend({
		className:'city-item-viz-inner',
		template:_.template(templateString),
		regions:{
			'landUse':'.land-use',
			'parcelSize':'.parcelSize'
		},
		ui:{
			'allViz':'.viz'
		},

		initialize:function(){
			this.listenTo(this.model,'sync',this.showViz,this);
		},
		onShow:function(){
			console.log('cityItem:'+this.model.id+':viz:show');
			this.ui.allViz.addClass('loading');
			this.model.fetch();
		},
		showViz:function(){
			//Model has been updated and sync'ed, show viz
			this.landUse.show(new LandUseChartView({model:this.model}));
			this.ui.allViz.removeClass('loading');
		}
	});

	return CityItemVizView;
})