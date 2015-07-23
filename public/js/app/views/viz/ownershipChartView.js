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
		m = { t:40,r:10,b:20,l:10 },
		radius;
	var	colorScale = d3.scale.ordinal().domain(["Private","City-owned","Partner controlled"]).range(['#03afeb','#d6d4ea','#96d5cf'])
	var format = d3.format('.1%');

	var pie = d3.layout.pie()
		.value(function(d){
			return d3.sum(d.values, function(v){return v.lot_size;})
		})
		.padAngle(Math.PI/90);
	var arc = d3.svg.arc();

	//TODO: placeholder

	var OwnershipChartView = Marionette.ItemView.extend({
		className:'ownership viz-inner',
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

			//parse data to for pie
			//Assign ownership categories, then nest to create hierarchy
			parcels.forEach(function(parcel){
				if(parcel.city_owned==true){ parcel.ownershipCategory = 'City-owned'}
				else if(parcel.partner_owned==true){ parcel.ownershipCategory = "Partner controlled"}
				else{ parcel.ownershipCategory = "Private" }
			});
			var nest = d3.nest().key(function(d){return d.ownershipCategory;}),
				data = nest.entries(parcels);

			//Set up svg generator
			radius = d3.min([width,height])/2-30;
			arc
				.innerRadius(radius-5)
				.outerRadius(radius);

			this.drawPieChart(data);

			//Append labels etc.
			d3.select(this.el).append('h3').html('Public vs. Private Ownership');

		},

		onBeforeDestroy:function(){
			vent.off('ownershipChartView:hover');
			vent.off('ownershipChartView:out');
		},

		drawPieChart:function(data){
			var that = this;

			var slices = this.svg.selectAll('.slice')
				.data(pie(data),function(d){return d.data.key});

			var slicesEnter = slices.enter()
				.append('g')
				.attr('class','slice')
				.attr('transform','translate('+width/2+','+height/2+')');

			//invisible mouse target
			slicesEnter
				.append('path')
				.style('fill','red')
				.style('fill-opacity',0)
				.attr('d',d3.svg.arc().innerRadius(0).outerRadius(radius+5));

			//real slices
			slicesEnter
				.append('path')
				.attr('class','slice-front')
				.style('fill',function(d){return colorScale(d.data.key)})
				.style('opacity',0)
				.transition()
				.duration(500)
				.attrTween('d',arcTween) //custom arc tween
				.style('opacity',1);


			//Events
			vent.on('ownershipChartView:hover',function(cat){

				that.svg.selectAll('.slice-front')
					.style('opacity',.2)
					.filter(function(d){return d.data.key == cat;})
					.style('opacity',1);
			});
			vent.on('ownershipChartView:out',function(){
				that.svg.selectAll('.slice-front')
					.style('opacity',1);
			})

			slices.on('mouseenter',function(d){
				vent.trigger('ownershipChartView:hover',d.data.key);
			})
			slices.on('mouseleave',function(d){
				vent.trigger('ownershipChartView:out');
			})


			//custom arc tween function
			function arcTween(d,i,a){
				var i = d3.interpolate({
					startAngle:d.startAngle,
					endAngle:d.startAngle
				},d); 

				//return an interpolater function
				return function(t){
					return arc(i(t));
				}
			}
		}

	});

	return OwnershipChartView;
})