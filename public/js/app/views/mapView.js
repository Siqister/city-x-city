define([
	'marionette',
	'leaflet',
	'd3',

	'vent',

	'app/collections/parcelsCollection',
	'app/models/parcelModel',
	'app/collections/cityCollection',
	'app/collections/assetCollection',
	'app/collections/investmentCollection',
	'app/models/assetModel',
	'app/models/investmentModel'

],function(
	Marionette,
	L,
	d3,

	vent,

	parcelsCollection,
	ParcelModel,
	cityCollection,
	assetCollection,
	investmentCollection,
	AssetModel,
	InvestmentModel
){

	//module internal variables for keeping leaflet+d3
	var map, svg, g, features, editMarker;

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

	var assetIconEdit = L.icon({
		iconUrl:'../style/assets/pin_asset-edit.png',
		iconSize:[30,30],
		iconAnchor:[15,15]
	});
	var investmentIconEdit = L.icon({
		iconUrl:'../style/assets/pin_investment-edit.png',
		iconSize:[30,30],
		iconAnchor:[15,15]
	});
	var assetIcon = L.icon({
		iconUrl:'../style/assets/pin_asset.png',
		iconSize:[30,30],
		iconAnchor:[15,15]
	});
	var investmentIcon = L.icon({
		iconUrl:'../style/assets/pin_investment.png',
		iconSize:[30,30],
		iconAnchor:[15,15]
	});
	var assetMarkerHash = d3.map(), investmentMarkerHash = d3.map(); //allows one to one look-up between map icons and asset models


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

			//broadcast map zoom and move events
			map.on('zoomstart movestart',function(){
				vent.trigger('map:change:start');
			});
			map.on('zoomend moveend',function(){
				vent.trigger('map:change:end');
			})


			//ask parcels collection to sync
			this.collection.fetch();
			//ask assetCollection to sync
			this.listenTo(assetCollection,'reset',this.drawAssetMarkers,this);
			assetCollection.fetch({reset:true});

			this.listenTo(investmentCollection,'reset',this.drawInvestmentMarkers,this);
			investmentCollection.fetch({reset:true});
		},

		drawParcels:function(){
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
					var parcelModel = that.collection.get(d.cartodb_id);
					vent.trigger('parcel:detail:show',parcelModel);
					vent.trigger('ui:show:detail');
				});

			features
				.transition()
				.style('stroke',function(d){
					return d.marked==true?'#ef4136':null;
				})
				.style('stroke-width',function(d){
					return d.marked==true?'2px':null;
				})
				.style('fill',function(d){
					if(d.city_owned==true){
						return '#d6d4ea';
					}else if(d.partner_owned==true){
						return '#96d5cf';
					}else{
						return null;
					}
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

			cityCollection.forEach(function(cityModel){
				var marker = L.marker([
					cityModel.get('geometry').coordinates[1],
					cityModel.get('geometry').coordinates[0]
				],{icon:cityIcon})
					.addTo(map)
					.on('mouseover',function(){
						vent.trigger('city:hover',cityModel.get('city'));
					})
					.on('mouseout',function(){
						vent.trigger('city:unhover',cityModel.get('city'));
					})
					.on('click',function(){
						vent.trigger('map:pan:city',cityModel);
					})

				cityIconHash[cityModel.get('city')] = marker;
			});
		},

		drawAssetMarkers:function(){
			console.log(assetCollection);
			var that = this;

			assetCollection.each(function(assetModel){
				that.addItem(assetModel)
			});
		},
		drawInvestmentMarkers:function(){
			var that = this;

			investmentCollection.each(function(investmentModel){
				that.addItem(investmentModel);
			});
		},


		highlightMarker:function(name){
			cityIconHash[name].setIcon(cityIconHighlight);
		},
		unHighlightMarker:function(name){
			cityIconHash[name].setIcon(cityIcon);
		},
		panToCity:function(model){
			//model can be city or parcel model
			var lngLat = model.get('geometry').coordinates;
			map.panTo(new L.LatLng(lngLat[1],lngLat[0]), {animate:true});
		},
		panToParcel:function(model){
			var xy = path.centroid(model.get('geometry')); //xy in pixels
			var latLng = map.layerPointToLatLng(new L.Point(xy[0],xy[1]));
			map.panTo(latLng,{animate:true});
		},

		addEditItem:function(e){
			console.log("Map:edit:add");

			var newModel;

			//remove any existing editMarker and instantiate new one
			if(editMarker){ map.removeLayer(editMarker); }
			editMarker = L.marker([
					e.cityModel.get('geometry').coordinates[1],
					e.cityModel.get('geometry').coordinates[0]
				],{
				icon:e.type=="asset"?assetIconEdit:investmentIconEdit,
				draggable:true
			});
			editMarker
				.on('add',function(e){
					vent.trigger('ui:edit:show', map.latLngToContainerPoint(this.getLatLng()) )
				})
				.addTo(map)
				.on('drag',function(){
					var thisMarker = this;

					thisMarker.setOpacity(.4);
					vent.trigger('ui:edit:hide');

					//dragging updates the location of the item
					var newGeo = {
						type:'Point',
						coordinates:[thisMarker.getLatLng().lng, thisMarker.getLatLng().lat]
					}
					newModel.set('geometry', newGeo);
				})
				.on('dragend',function(e){
					this.setOpacity(1);
					vent.trigger('ui:edit:reposition', map.latLngToContainerPoint(this.getLatLng()) );
				})


			//Create new itemModel and instantiate editView
			if(e.type == 'asset'){
				newModel = new AssetModel({
					city:e.cityModel.get('city'),
					geometry:e.cityModel.get('geometry')
				});
				vent.trigger('assetCollection:add', newModel);
			}else{
				newModel = new InvestmentModel({
					city:e.cityModel.get('city'),
					geometry:e.cityModel.get('geometry')
				});
				vent.trigger('investmentCollection:add', newModel);
			}

			vent.trigger('edit:show', newModel); //layoutView will show edit region
		},

		removeEditItem:function(){
			map.removeLayer(editMarker);
		},

		addItem:function(model){
			//model can be either investment or asset
			if(!model.get('geometry')){return; }

			//Create marker with the right icon, add it to map
			var marker = new L.marker([
					model.get('geometry').coordinates[1],
					model.get('geometry').coordinates[0]
				],{
					icon:model.get('type')=='asset'?assetIcon:investmentIcon
				});
			marker.addTo(map);

			//Add marker to correct icon hash
			if(model.get('type')=='asset'){
				assetMarkerHash.set(model.id,marker);
			}else{
				investmentMarkerHash.set(model.id,marker);
			}

			//Wire marker for clicks
			marker.on('click',function(e){
				if(model.get('type')=='asset'){
					vent.trigger('asset:detail:show',model)
				}else{
					vent.trigger('investment:detail:show',model)
				}
				vent.trigger('ui:show:detail');
			})
		}

	});

	var mapView = new MapView();

	vent.on('city:hover', mapView.highlightMarker);
	vent.on('city:unhover',mapView.unHighlightMarker);

	vent.on('map:pan:parcel',mapView.panToParcel);
	vent.on('map:pan:city',mapView.panToCity);
	vent.on('map:edit:add',mapView.addEditItem);
	vent.on('map:edit:remove',mapView.removeEditItem);

	vent.on('map:add:item',mapView.addItem);

	//When map pans or zooms, hide edit window temporarily
	vent.on('map:change:start',function(){
		vent.trigger('ui:edit:hide');
	});
	vent.on('map:change:end',function(){
		if(!editMarker){ return; }

		vent.trigger('ui:edit:reposition', map.latLngToContainerPoint(editMarker.getLatLng()) );
	});

	//When parcelsCollection is sync'ed, redraw parcels
	vent.on('parcel:update',mapView.drawParcels);

	vent.on('cityCollection:update',mapView.drawCityMarkers);

	vent.on('asset:delete',function(modelID){
		var assetMarker = assetMarkerHash.get(modelID);
		map.removeLayer(assetMarker);
	})
	vent.on('investment:delete',function(modelID){
		var investmentMarker = investmentMarkerHash.get(modelID);
		map.removeLayer(investmentMarker);
	})

	return new MapView();
})