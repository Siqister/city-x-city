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

	var cityIcon = L.icon({
		iconUrl:'../style/assets/pin-02.png',
		iconSize:[30,70],
		iconAnchor:[15,70]
	});
	var cityIconHighlight = L.icon({
		iconUrl:'../style/assets/pin-03.png',
		iconSize:[30,70],
		iconAnchor:[15,70]
	});
	var cityIconHash = {};

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
			this.listenTo(this.collection, 'sync', this.drawParcels);

			vent.on('cityCollection:update',this.drawCityMarkers);
		},

		onShow:function(){
			var that = this;
			console.log('mapView:show');

			//upon mapView:show, initialize leaflet map
			map = L.map(this.el).setView([42.3, -71.8], 9);
			L.tileLayer('https://a.tiles.mapbox.com/v4/siqizhu01.1375d69e/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2lxaXpodTAxIiwiYSI6ImNiY2E2ZTNlNGNkNzY4YWYzY2RkMzExZjhkODgwMDc5In0.3PodCA0orjhprHrW6nsuVw')
				.addTo(map);

			svg = d3.select(map.getPanes().overlayPane).append('svg');
			g = svg.append('g').attr('class','leaflet-zoom-hide');



			//ask parcels collection to sync
			this.collection.fetch();
		},

		drawParcels:function(){
			console.log('parcelCollection:updated');
			console.log('mapView:redrawParcels');
			var that = this;

			features = g.selectAll('.parcel')
				.data(that.collection.toJSON(),function(d){return d.cartodb_id});

			var featuresEnter = features
				.enter()
				.append('path')
				.attr('class','parcel')
				.on('click', function(d){
					//a parcel is clicked on
					console.log(d);
					var parcelModel = new ParcelModel(d);
					vent.trigger('parcel:detail:show',parcelModel);
					vent.trigger('ui:show:detail');
				});

			features
				.transition()
				.style('fill',function(d){
					return d.marked==true?'#ef4136':null;
				})

			map.off('viewreset', that.mapViewReset, that);
			map.on('viewreset', that.mapViewReset, that); //context is MapView

			that.mapViewReset(); //position svg and generate shapes for parcel features			
		},

		mapViewReset:function(){
			var that = this;

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
		},

		drawCityMarkers:function(cityCollection){
			var cities = cityCollection.toJSON();

			cities.forEach(function(city){
				var marker = L.marker([
					city.geometry.coordinates[1],
					city.geometry.coordinates[0]
				],{icon:cityIcon})
					.addTo(map)
					.on('mouseover',function(){
						vent.trigger('city:hover',city.city);
					})
					.on('mouseout',function(){
						vent.trigger('city:unhover',city.city);
					})
					.on('click',function(){
						vent.trigger('city:click',city);
					})

				cityIconHash[city.city] = marker;
			});
		},
		highlightMarker:function(name){
			cityIconHash[name].setIcon(cityIconHighlight);
		},
		unHighlightMarker:function(name){
			cityIconHash[name].setIcon(cityIcon);
		},
		cityClick:function(city){
			var lngLat = city.get('geometry').coordinates;
			map.panTo(new L.LatLng(lngLat[1],lngLat[0]), {animate:true});
		}

	});

	var mapView = new MapView();

	vent.on('city:hover', mapView.highlightMarker);
	vent.on('city:unhover',mapView.unHighlightMarker);
	vent.on('city:click',mapView.cityClick);

	return new MapView();
})