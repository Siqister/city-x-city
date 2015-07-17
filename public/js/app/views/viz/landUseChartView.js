define([
	'marionette',
	'underscore',
	'd3',

	'vent'
],function(
	Marionette,
	_,
	d3,

	vent
){
	var width,height,
		m = {
			t:40,r:10,b:20,l:10
		};
	var	colorScale = d3.scale.linear().domain([0,29]).range(['#03afeb','red'])
	var histogram = d3.layout.histogram()
		.value(function(d){
			return d.land_val/d.lot_size;
		});
	var format = d3.format('.1%');

	//TODO: placeholder
	var maxValPerAcre = 3e6;

	var LandUseChartView = Marionette.ItemView.extend({
		className:'land-use-inner viz-inner',
		template:false,

		tooltip:null,
		svg:null,

		getScales:function(){
			return {
				x:d3.scale.linear(),
				y:d3.scale.linear()
			};
		},

		onShow:function(){

			var parcels = this.model.get('parcels');

			//Set up canvas attributes
			width = this.$el.outerWidth() - m.r - m.l,
			height = this.$el.outerHeight() - m.t - m.b;

			this.svg = d3.select(this.el)
				.append('svg')
				.attr('width',width+m.r+m.l)
				.attr('height',height+m.t+m.b)
				.append('g')
				.attr('class','viz')
				.attr('transform','translate('+m.l+','+m.t+')');

			//Set up scales and layout data
			this.scale = this.getScales();

			this.scale.x
				.domain([0,maxValPerAcre])
				.range([0,width]);

			histogram
				.bins(this.scale.x.ticks(30));

			data = histogram(parcels) //returns array with x, dx, y

			this.scale.y
				.domain([0,d3.max(data,function(d){return d.y;})])
				.range([height,0]);



			//Begin drawing histogram
			this.drawHistogram(data);

			//Labels
			d3.select(this.el).append('h3').html('Land Value Distribution')

			this.svg.append('line')
				.attr('class','x-scale scale')
				.attr('y1',height)
				.attr('y2',height)
				.attr('x1',0)
				.attr('x2',width);

			//Tooltip
			this.tooltip = this.svg.append('g')
				.attr('class','custom-tooltip')
				.style('opacity',0);

			this.tooltip
				.append('circle')
				.attr('r',3)
				.style('fill','white')
				.style('stroke','rgb(80,80,80)')
				.style('stroke-width','1px');
			this.tooltip
				.append('text')
				.attr('text-anchor','middle')
				.attr('y',-7)
				.text('hello');

		},

		onBeforeDestroy:function(){
			vent.off('landUseChartView:hover');
		},

		drawHistogram:function(data){
			var that = this,
				numOfParcels = that.model.get('parcels').length;

			var bins = this.svg.selectAll('.bin')
				.data(data,function(d){return d.x;});

			var binsEnter = bins.enter()
				.append('g')
				.attr('class','bin');

			binsEnter
				.append('rect')
				.attr('class','bin-rect')
				.attr('x',function(d){return that.scale.x(d.x)})
				.attr('y',function(d){return 0;})
				.attr('width',function(d){return that.scale.x(d.dx)})
				.attr('height',function(d){return height;})
				.style('fill-opacity',0);
			binsEnter
				.append('line')
				.attr('class','bin-line')
				.attr('x1',function(d){return that.scale.x(d.x+d.dx/2)})
				.attr('x2',function(d){return that.scale.x(d.x+d.dx/2)})
				.attr('y1',height)
				.attr('y2',height)
				.style('stroke-width','2px')
				.style('stroke',function(d,i){
					return colorScale(i);
				})
				.style('opacity',.7)
				.transition()
				.attr('y2',function(d){return that.scale.y(d.y)});

			//Bin hover events
			vent.on('landUseChartView:hover',function(xVal){
				var yVal,dx;

				bins
					.attr('class','bin')
					.selectAll('.bin-line')
					.style('stroke-width','2px')
					.style('opacity',.7)
				bins
					.filter(function(d){return d.x == xVal})
					.attr('class',function(d){
						yVal = d.y;
						dx = d.dx;
						return 'bin highlight';
					})
					.select('.bin-line')
					.style('stroke-width','3px')
					.style('opacity',1);

				that.tooltip
					.attr('transform', 'translate('+that.scale.x(xVal+dx/2)+','+that.scale.y(yVal)+')')
					.style('opacity',1)
					.select('text')
					.text(format(yVal/numOfParcels));
			});
			bins.on('mouseenter',function(d){
				vent.trigger('landUseChartView:hover',d.x);
			});
		}
	});

	return LandUseChartView;
})