define([
	'marionette',
	'underscore',

	'vent',

	'app/views/viz/landUseChartView',
	'app/views/viz/ownershipChartView',
	'app/views/viz/summaryView',

	'text!app/templates/cityItemVizView.html',

	'bootstrap-dropdown'
],function(
	Marionette,
	_,

	vent,

	LandUseChartView,
	OwnershipChartView,
	SummaryView,

	cityItemVizViewTemplate
){

	//this is the master controller for which visualizations to display
	var CityItemVizView = Marionette.LayoutView.extend({
		className:'city-item-viz-inner',
		template:_.template(cityItemVizViewTemplate),
		regions:{
			'viz':'.viz',
		},
		ui:{
			'viz':'.viz',
			'options':'.viz-type-option'
		},
		events:{
			'click @ui.options': function(e){
				vent.trigger('vizType:change', $(e.target).attr('id'));
			}
		},

		initialize:function(){
			var that = this;

			this.listenTo(this.model,'sync',this.showViz,this);

			vent.on('vizType:change',function(typeId){
				that.changeVizType(typeId);
			});
		},
		onShow:function(){
			console.log('cityItem:'+this.model.id+':viz:show');

			this.ui.viz.addClass('loading');
			this.model.fetch();
		},
		onBeforeDestroy:function(){
			vent.off('vizType:change');
		},
		showViz:function(){
			//Model has been updated and sync'ed, show viz
			this.viz.show(new SummaryView({model:this.model}));
			this.ui.viz.removeClass('loading');
		},
		changeVizType:function(typeId){
			var that = this;
			switch(typeId){
				case 'land-val':
					that.viz.show(new LandUseChartView({model:that.model}));
					break;
				case 'public-ownership':
					that.viz.show(new OwnershipChartView({model:that.model}));
					break;
				case 'summary':
					that.viz.show(new SummaryView({model:that.model}));
					break;
			}
		}
	});

	return CityItemVizView;
})