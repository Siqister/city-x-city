define([
	'marionette',
	'underscore',
	'jquery',
	'd3',

	'vent',

	'app/collections/assetCollection',
	'app/collections/investmentCollection'
],function(
	Marionette,
	_,
	$,
	d3,

	vent,

	assetCollection,
	investmentCollection
){

	//SummaryView is based on cityCollection, assetCollection, and investmentCollection
	var format = d3.format(','),
		format2 = d3.format(',d');

	var SummaryView = Marionette.ItemView.extend({
		className:'summary viz-inner',
		template:false,

		tooltip:null,
		svg:null,

		ui:{
			addItem:'.add'
		},
		events:{
			'click @ui.addItem':'addItem'
		},

		initialize:function(){
			var that = this;

			vent.on('assetCollection:sync',function(){
				that.redraw();
			});
			vent.on('investmentCollection:sync',function(){
				that.redraw();
			})
		},

		onShow:function(){
			//this.model => cityModel

			var cityName = this.model.id;

			//Array of asset models
			var cityAssets = assetCollection.filter(function(assetModel){return assetModel.get('city') == cityName;})
			//Array of investment models
			var cityInvestments = investmentCollection.filter(function(investmentModel){return investmentModel.get('city') == cityName;})
			var investmentSum = _.reduce(cityInvestments,function(memo,investment){return memo + +(investment.get('value'));}, 0);


			var list = d3.select(this.el)
				.append('ul').attr('class','data-list');

			var listItems = list.selectAll('.list-item')
				.data([
					{meta:'assets',digits:cityAssets.length,add:'asset'},
					{meta:'investments',digits:cityInvestments.length,add:'investment'},
					{meta:'total investment value',digits:'$'+format(investmentSum)}
				],function(d){return d.meta})
				.enter()
				.append('li').attr('class','list-item');

			listItems
				.filter(function(d){return d.add})
				.attr('class','list-item add')
				.attr('id',function(d){return d.add})
				.append('span').attr('class','glyphicon glyphicon-plus add-btn');
			listItems
				.append('span').attr('class','digits')
				.text(function(d){return d.digits});
			listItems
				.append('span').attr('class','meta')
				.text(function(d){return d.meta});
		},

		addItem:function(e){
			e.stopPropagation();

			vent.trigger('map:edit:add',{
				xy:[e.pageX,e.pageY],
				cityModel:this.model,
				type:$(e.target).attr('id')
			}); //TODO: figure out the precise location
		},

		redraw:function(){
			var cityName = this.model.id;

			//Array of asset models
			var cityAssets = assetCollection.filter(function(assetModel){return assetModel.get('city') == cityName;})
			//Array of investment models
			var cityInvestments = investmentCollection.filter(function(investmentModel){return investmentModel.get('city') == cityName;})
			var investmentSum = _.reduce(cityInvestments,function(memo,investment){return memo + +(investment.get('value'));}, 0);
		
			var listItems = d3.select(this.el).selectAll('.list-item')
				.data([
					{meta:'assets',digits:cityAssets.length,add:'asset'},
					{meta:'investments',digits:cityInvestments.length,add:'investment'},
					{meta:'total investment value',digits:'$'+format(investmentSum)}
				],function(d){return d.meta});


			listItems
				.select('.digits')
				.text(function(d){return d.digits});
		},

		onBeforeDestroy:function(){
			vent.off('assetCollection:sync');
			vent.off('investmentCollection:sync');
		}
	});

	return SummaryView;
})