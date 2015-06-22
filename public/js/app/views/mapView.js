define([
	'marionette',
	'leaflet',
	'd3',

	'vent',

	'app/collections/parcelsCollection',
	'app/models/parcelModel'
],function(
	Marionette,
	L,
	d3,

	vent,

	parcelsCollection,
	ParcelModel
){

	//module internal variables for keeping leaflet+d3
	var map, svg, g, features;

	function projectPoint(x,y){
		var point = map.latLngToLayerPoint(new L.LatLng(y,x));
		this.stream.point(point.x,point.y);
	}
	var transform = d3.geo.transform({point:projectPoint}),
		path = d3.geo.path().projection(transform);


	//mapView
	var MapView = Marionette.ItemView.extend({
		//parcelsCollection rendered as an itemView

		className:'map-inner',
		template:false,

		collection:parcelsCollection, //use itemView to render a collection

		initialize:function(){
			this.listenTo(this.collection, 'update', this.drawParcels);
		},

		onShow:function(){
			console.log('mapView:show');

			//upon mapView:show, initialize leaflet map
			map = L.map(this.el).setView([42.3, -71.8], 9);
			L.tileLayer('https://a.tiles.mapbox.com/v4/siqizhu01.map-8r4ecoz0/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2lxaXpodTAxIiwiYSI6ImNiY2E2ZTNlNGNkNzY4YWYzY2RkMzExZjhkODgwMDc5In0.3PodCA0orjhprHrW6nsuVw')
				.addTo(map);

			//ask parcels collection to sync
			this.collection.fetch();
		},

		drawParcels:function(){
			console.log('mapView:drawParcels')
			var that = this;

			svg = d3.select(map.getPanes().overlayPane).append('svg');
			g = svg.append('g').attr('class','leaflet-zoom-hide');

			features = g.selectAll('path')
				.data(that.collection.toJSON())
				.enter()
				.append('path')
				.attr('class','parcel');

			features
				.on('click', onParcelClick);

			map.on('viewreset', reset);
			reset();

			function reset(){
				//position svg and g
				var bounds = path.bounds({
					type:'FeatureCollection',
					features: that.collection.toJSON()
				});
				var tl = bounds[0],
					br = bounds[1];
				svg.attr('width',br[0]-tl[0])
					.attr('height',br[1]-tl[1])
					.style('left',tl[0]+'px')
					.style('top',tl[1]+'px');
				g
					.attr('transform','translate('+ -tl[0] +','+ -tl[1] + ')');

				features.attr('d',path);
			}

			function onParcelClick(d){
				var parcelModel = new ParcelModel(d.properties);

				vent.trigger('parcel:detail:show',parcelModel);
				vent.trigger('ui:pos:detail');
			}
			
		}

	});

	return new MapView();
})