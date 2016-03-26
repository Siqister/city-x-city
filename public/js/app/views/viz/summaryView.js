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
		activatingToggle: false,
		tooltip:null,
		svg:null,

		ui:{
			addItem:'.add-btn',
			toggleActivating: '.toggleActivating'
		},
		events:{
			'click @ui.addItem':'addItem',
			'click @ui.toggleActivating': 'toggleActivating'
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
			var cityAssets = assetCollection.where({city: cityName, activating: this.activatingToggle});
			//Array of investment models
			var cityInvestments = investmentCollection.filter(function(investmentModel){return investmentModel.get('city') == cityName;})
			var investmentSum = _.reduce(cityInvestments,function(memo,investment){return memo + +(investment.get('value'));}, 0);


			var list = d3.select(this.el)
				.append('ul').attr('class','data-list');

			var listItems = list.selectAll('.list-item')
				.data([
					{meta:'features',digits:cityAssets.length,add:'feature'},
					{meta:'investments',digits:cityInvestments.length,add:'investment'},
					{meta:'total investment value',digits:'$'+format(investmentSum)}
				],function(d){return d.meta})
				.enter()
				.append('li').attr('class','list-item');

			listItems
				.filter(function(d){return d.add})
				.attr('class','list-item add')
				//.attr('id',function(d){return d.add})
				.append('span').attr('class','glyphicon glyphicon-plus add-btn').attr('id',function(d){return d.add});
			listItems
				.append('span').attr('class','digits')
				.text(function(d){return d.digits});
			listItems
				.append('span').attr('class','meta')
				.text(function(d){return d.meta});

			var toggle = list.append("li").attr("class", "add form-group activating attr-list-item");
			toggle.append("label").attr("for", "activating").text("Show only activating?: ");
			toggle.append("input").attr("type", "checkbox")
						.attr("class", "toggleActivating")
						.attr("name", "activating")
						.attr("id", "activating");
		},

		addItem:function(e){
			e.stopPropagation();

			console.log($(e.target).attr('id'))

			vent.trigger('map:edit:add',{
				xy:[e.pageX,e.pageY],
				cityModel:this.model,
				type:$(e.target).attr('id')
			}); //TODO: figure out the precise location

			vent.trigger('ui:hide:detail');
		},

		toggleActivating: function(e) {
			e.stopPropagation();

			if (this.activatingToggle) {
				this.activatingToggle = false;
			} else {
				this.activatingToggle = true;
			}
			
			vent.trigger("asset:toggle:activating", { activating: this.activatingToggle });
			this.redraw();
		},

		redraw:function(){
			var cityName = this.model.id;

			//Array of asset models
			var cityAssets = assetCollection.where({city: cityName, activating: this.activatingToggle})
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