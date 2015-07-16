define([
	'marionette',
	'underscore',
	'd3'
],function(
	Marionette,
	_,
	d3
){
	var svg,width,height,
		m = {
			t:40,r:10,b:20,l:10
		};
	var xScale = d3.scale.linear(),
		yScale = d3.scale.linear(),
		colorScale = d3.scale.linear().domain([0,29]).range(['#03afeb','red'])
	var histogram = d3.layout.histogram()
		.value(function(d){
			return d.land_val/d.lot_size;
		})

	//TODO: placeholder
	var maxValPerAcre = 3e6;

	var LandUseChartView = Marionette.ItemView.extend({
		className:'land-use-inner viz-inner',
		template:false,

		onShow:function(){

			var parcels = this.model.get('parcels');

			width = this.$el.outerWidth() - m.r - m.l,
			height = this.$el.outerHeight() - m.t - m.b;

			svg = d3.select(this.el)
				.append('svg')
				.attr('width',width+m.r+m.l)
				.attr('height',height+m.t+m.b)
				.append('g')
				.attr('class','viz')
				.attr('transform','translate('+m.l+','+m.t+')');

			xScale
				.domain([0,maxValPerAcre])
				.range([0,width]);

			histogram
				.bins(xScale.ticks(30));

			data = histogram(parcels) //returns array with x, dx, y

			yScale
				.domain([0,d3.max(data,function(d){return d.y;})])
				.range([height,0]);
			//console.log(d3.max(parcels,function(d){return d.land_val/d.lot_size;}));

			this.drawHistogram(data);

			//Scales, labels etc.
			d3.select(this.el).append('h3').html('Land Value Distribution')

			svg.append('line')
				.attr('class','x-scale scale')
				.attr('y1',height)
				.attr('y2',height)
				.attr('x1',0)
				.attr('x2',width);

		},

		drawHistogram:function(data){
			console.log(data);

			var bins = svg.selectAll('.bin')
				.data(data,function(d){return d.x;});

			bins
				.enter()
				.append('line')
				.attr('class','bin')
				.attr('x1',function(d){return xScale(d.x+d.dx/2)})
				.attr('x2',function(d){return xScale(d.x+d.dx/2)})
				.attr('y1',height)
				.attr('y2',height)
				.style('stroke-width','2px')
				.style('stroke',function(d,i){
					return colorScale(i);
				})

			bins.transition()
				.attr('y2',function(d){return yScale(d.y)})

		}
	});

	return LandUseChartView;
})