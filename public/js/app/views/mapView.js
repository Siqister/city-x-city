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
	'app/models/investmentModel',

	'config'

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
	InvestmentModel,

	config
){

	//module internal variables for keeping leaflet+d3
	var map, svg, g, features, editMarker, parcelMarker, clusterGroup;
	var mapBackground = {};

	var cityIcon = L.icon({
		iconUrl:'../style/assets/pin-02.png',
		iconSize:[20,46],
		iconAnchor:[10,46]
	});

	var fellowsIcon = L.icon({
		iconUrl:'../style/assets/fellow.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	});

	var nonFellowsIcon = L.icon({
		iconUrl:'../style/assets/nofellow.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	});

	var cityIconHighlight = L.icon({
		iconUrl:'../style/assets/pin-03.png',
		iconSize:[20,46],
		iconAnchor:[10,46]
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

	var investmentIconPrivate = L.icon({
		iconUrl:'../style/assets/pin_investment_private.png',
		iconSize:[30,30],
		iconAnchor:[15,15]
	});

	var parcelIcon = L.icon({
		iconUrl:'../style/assets/pin-04.png',
		iconSize:[20,46],
		iconAnchor:[10,46]
	});

	var assetIconClasses = { business: L.icon({
		iconUrl:'../style/assets/business.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

	parking: L.icon({
		iconUrl:'../style/assets/parking.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		community: L.icon({
		iconUrl:'../style/assets/community.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		culture: L.icon({
		iconUrl:'../style/assets/culture.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		education: L.icon({
		iconUrl:'../style/assets/education.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		food: L.icon({
		iconUrl:'../style/assets/food.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		government: L.icon({
		iconUrl:'../style/assets/government.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		health: L.icon({
		iconUrl:'../style/assets/health.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		park: L.icon({
		iconUrl:'../style/assets/park.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

		retail: L.icon({
		iconUrl:'../style/assets/retail.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}),

	temporary: L.icon({
		iconUrl:'../style/assets/temporary.png',
		iconSize:[40,40],
		iconAnchor:[15,15]
	}) };

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
		currentLayer:undefined,
		filterObject: {
			activating: true
		},
		collection:parcelsCollection, //use itemView to render a collection

		initialize:function(){
			//listen to only the initial population of the parcelsCollection
			this.listenToOnce(this.collection, 'sync', this.drawParcels);

		},

		onShow:function(){
			var that = this;
			console.log('mapView:show');

			//upon mapView:show, initialize leaflet map
			map = L.map(this.el, { maxBounds: [[41.253,-73.5081],[42.8867,-69.8621]], minZoom: 9 }).setView([42.3, -71.8], 9);
			mapBackground.satellite = L.tileLayer('https://a.tiles.mapbox.com/v4/siqizhu01.nok599k9/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2lxaXpodTAxIiwiYSI6ImNiY2E2ZTNlNGNkNzY4YWYzY2RkMzExZjhkODgwMDc5In0.3PodCA0orjhprHrW6nsuVw')
				.addTo(map);
			mapBackground.street = L.tileLayer('https://api.mapbox.com/styles/v1/nmonani/ciq9iw3fg00b0cam12nj4wieq/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibm1vbmFuaSIsImEiOiJjaXE5aW5kbWMwMWpiZm5ra253bzJvcndqIn0.hZ_VvUXgZ2XWZ58CM60Y0Q')
				.addTo(map);

			clusterGroup = L.markerClusterGroup({disableClusteringAtZoom: 17});


			//overlay for D3 drawing --> after 3D building in terms of z-index
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
			this.collection.fetch({ success: function() {
				map.addLayer(clusterGroup);
			} });
			//ask assetCollection to sync
			this.listenTo(assetCollection,'reset',this.drawAssetMarkers,this);
			assetCollection.fetch({reset:true});

			this.listenTo(investmentCollection,'reset',this.drawInvestmentMarkers,this);
			investmentCollection.fetch({reset:true});


			
			map.addControl(new L.Control.Zoomslider({position: 'topright'}));

			//upon mapView:show and map initialization, add 3D building overlay
			L.imageOverlay(
				'../assets/brockton_App overlay.svg', //imageUrl
				L.latLngBounds([[42.07924,-71.0226],[42.08682,-71.01443]]),
				{ opacity: 0.5 } //SW and NE
			)
				.addTo(map);
				
			L.imageOverlay(
				'../assets/springfield_App overlay.svg', //imageUrl
				L.latLngBounds([[42.10155381,-72.59665675],[42.10856358,-72.58559589]]),
				{ opacity: 0.5 } //SW and NE
			)
				.addTo(map);

			L.imageOverlay(
				'../assets/lynn_raster.png', //imageUrl
				L.latLngBounds([[42.4616537098401849,-70.9495558575365521],[42.4657603870983564, -70.9402473890846892]]),
				{ opacity: 0.5 } //SW and NE
			)
				.addTo(map);

			L.imageOverlay(
				'../assets/revere_raster.png', //imageUrl
				L.latLngBounds([[42.4043493490063739,-70.9969339679200999],[42.4090765020624758,-70.9909995396794073]]),
				{ opacity: 0.5 } //SW and NE
			)
				.addTo(map);

			L.imageOverlay(
				'../assets/haverhill_raster.png', //imageUrl
				L.latLngBounds([[42.7729823689840956,-71.0824799701656218],[42.7763740561438226,-71.0765482287125963]]),
				{ opacity: 0.5 } //SW and NE
			)
				.addTo(map);

			L.imageOverlay(
				'../assets/2016-07-27 Holyoke Buildings 3D.png',
				L.latLngBounds([[42.2087310719534301,-72.5998351767299255],[42.2002863600326776,-72.6134405459355889]]),
				{ opacity: 0.5 } )
			.addTo(map);
		},

		drawParcels:function(){
			console.log('mapView:redrawParcels:layer:'+this.currentLayer);
			var that = this;


			features = g.selectAll('.parcel')
				.data(that.collection.toJSON(),function(d){return d.cartodb_id});

			var featuresEnter = features
				.enter()
				.append('path')
				.on('click', function(d){
					//a parcel is clicked on
					var parcelModel = that.collection.get(d.cartodb_id);

					//create a new parcelMarker and add it to parcel centroid
					var parcelCentroid = d3.geo.centroid(d);
					if(parcelMarker){ map.removeLayer(parcelMarker); }
					parcelMarker = L.marker([
							parcelCentroid[1],
							parcelCentroid[0]
						],{
							icon:parcelIcon
						})
						.addTo(map);

					vent.trigger('parcel:detail:show',parcelModel);
					vent.trigger('ui:show:detail');
				})
				.on('mouseenter',function(d){
					d3.select(this)
						.style('fill-opacity',.35)
						.style('stroke-width','2px');

				})
				.on('mouseleave',function(d){
					d3.select(this)
						.style('fill-opacity',.2)
						.style('stroke-width',null);
				})

			//Style parcel stroke based "marked" model attribute
			features
				.style('stroke',function(d){
					return d.marked==true?'#ef4136':null;
				})
				.attr('class',function(d){
					var classes = "parcel";
					if(d.city_owned == true || d.partner_owned == true){
						classes += " publicly-owned";
					}
					if(d.tdi_for_sale == true){ classes += " for-sale"; }
					if(d.tdi_for_lease == true){ classes += " for-lease"; }
					if(d.marked == true){ classes += " marked"; }

					return classes;
				})

			//Style parcel fill based on land use, vacancy, or ownership, as determined by
			//this.currentLayer
			that.showLayer(that.currentLayer);

			map.off('viewreset', that.mapViewReset, that);
			map.on('viewreset', that.mapViewReset, that); //context is MapView

			//Set parcel shape attribute
			that.mapViewReset(); //position svg and generate shapes for parcel features			
		},

		showLayer:function(col){
			//@param col: name of the cartodb column to thematically map by
			console.log('mapView:show:themeLayer:'+col);

			var mapLayerConfig = d3.map(config.mapLayers,function(d){return d.cartodbCol;});

			if(col==undefined){
				//this is the case where parcels are colored by ownership
				features
					.transition()
					.style('fill',function(d){
						if(d.city_owned==true){
							return '#de2d26';
						}else if(d.partner_owned==true){
							return '#2c7fb8';
						}else{
							return null;
						}
					})
					.style('fill-opacity',function(d){
						if(d.city_owned == true || d.partner_owned == true){
							return .7;
						}else{
							return null;
						}
					});
			}
			else{
				var options = d3.map( (mapLayerConfig.get(col)).options, function(d){return d.cartodbVal;} ),
					_default = (mapLayerConfig.get(col)).defaults;

				features
					.transition()
					.style('fill',function(d){
						var _d = d[col],
							option = options.get(_d);

						if(option){
                            return option.color;
						}else{
							return _default.color;
						}
					})
					.style('fill-opacity',.7);
			}

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

		setZoom:function(zoom){
			console.log('map:zoom:to:'+zoom);
			map.setZoom(zoom);
		},

		drawCityMarkers:function(cityCollection){

			cityCollection.forEach(function(cityModel){
				var city = cityModel.get('city');
				if (city == "BROCKTON" || 
						city == "HAVERHILL" || 
						city == "LYNN" || 
						city == "NEW BEDFORD" || 
						city == "PITTSFIELD" || 
						city == "SPRINGFIELD") {

							cityIcon = fellowsIcon;
						} else {
							cityIcon = nonFellowsIcon;
						}

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
						map.zoomIn(8);
						console.log("change zoom");
					})

				cityIconHash[cityModel.get('city')] = marker;
			});
		},

		drawAssetMarkers:function(filterObject){
			var that = this;
			console.log("Filter Object ", that.filterObject);
			if (that.filterObject.activating == true) {
				// filter only when true
				var filteredAssetCollection = assetCollection.where(that.filterObject);
			} else {
				var filteredAssetCollection = assetCollection.where({});
			}
			
			filteredAssetCollection.forEach(function(assetModel){
				that.addItem(assetModel)
			});
		},
		drawInvestmentMarkers:function(filterObject){
			var that = this;
			var filteredInvestmentCollection = investmentCollection.where({});	
			if (that.filterObject.on == true) {
				var filteredInvestmentCollection = investmentCollection.where(that.filterObject);
			} else {
				var filteredInvestmentCollection = investmentCollection.where({});
			}

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
			console.log("Map:edit:add:type:"+e.type);

			var newModel;

			//remove any existing editMarker and instantiate new one
			if(editMarker){ map.removeLayer(editMarker); }
			var icon = investmentIcon;
			if (e.type =="feature") {
				icon = assetIconEdit;
			}

			if (e.type =="investment" && e.investmentType == "equity") {
				icon = investmentIconEdit;
			}

			if (e.type =="investment" && e.investmentType == "private") {
				icon = investmentIconPrivate;
			}

			editMarker = L.marker([
					e.cityModel.get('geometry').coordinates[1],
					e.cityModel.get('geometry').coordinates[0]
				],{
				icon:icon,
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
			if(e.type == 'feature'){
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

			if(editMarker){ map.removeLayer(editMarker); }

			function returnCorrectIcon() {
				var assetTypeIcons = [{type: "Park / Open Space",icon: "park"},{type: "Community",icon: "community"},{type: "Government ",icon: "government"},{type: "Health Care",icon: "health"},{type: "Food",icon: "food"},{type: "Education",icon: "education"},{type: "Business",icon: "business"},{type: "Parking",icon: "parking"},{type: "Cultural & Entertainment",icon: "culture"},{type: "Temporary",icon: "temporary"},{type: "Retail",icon: "retail"}];
				var icon = investmentIcon;
				if (model.get("type") =="asset") {
					assetTypeIcons.forEach(function(assetTypeIcon) {
						if (model.get("assetType") == assetTypeIcon.type) {
							console.log(model.get("assetType"));
							icon = assetIconClasses[assetTypeIcon.icon];
							console.log("inside loop: ", icon);
						}
						
					});
					console.log("outside loop:", icon)
				}
				

				if (model.get("type") =="investment" && model.get("investmentType") == "equity") {
					icon = investmentIcon;
				}
				if (model.get("type") =="investment" && model.get("investmentType") == "private") {
					icon = investmentIconPrivate;
				}  
				return icon;
			}




			//Create marker with the right icon, add it to map
			var marker = new L.marker([
					model.get('geometry').coordinates[1],
					model.get('geometry').coordinates[0]
				],{
					icon:returnCorrectIcon()
				});
			// marker.addTo(map);
			clusterGroup.addLayer(marker);

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
		},

		toggleBackground:function(layerName){
			mapBackground[layerName].bringToFront();
		}

	});

	var mapView = new MapView();

	// vent.on('city:hover', mapView.highlightMarker);
	// vent.on('city:unhover',mapView.unHighlightMarker);

	vent.on('map:pan:parcel',mapView.panToParcel);
	vent.on('map:pan:city',mapView.panToCity);
	vent.on('map:edit:add',mapView.addEditItem);
	vent.on('map:edit:remove',mapView.removeEditItem);
	vent.on('map:setzoom',mapView.setZoom);

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
	//triggered by parcelView
	vent.on('parcel:update',function(){mapView.drawParcels()});

	vent.on('cityCollection:update',mapView.drawCityMarkers);

	vent.on('asset:delete',function(modelID){
		var assetMarker = assetMarkerHash.get(modelID);
		clusterGroup.removeLayer(assetMarker);
	})

	vent.on('asset:toggle:activating', function(c) {
		if (mapView.filterObject.activating) {
			mapView.filterObject.activating = false;
		} else {
			mapView.filterObject.activating = true;
		}

		// remove everything for a redraw
		var values = assetMarkerHash.values();
		values.forEach(function(key) {
			clusterGroup.removeLayer(key);
		});

		// after removal, reset
		assetCollection.trigger("reset");
		// get models ids from the filter
		// call the assetMarkerHash and get the model ids. 
		// assetCollection.trigger("reset");
		// assetCollection.trigger("sync");

	});

	vent.on('investment:delete',function(modelID){
		var investmentMarker = investmentMarkerHash.get(modelID);
		clusterGroup.removeLayer(investmentMarker);
	})


	//Listen to events recoloring the parcel layer
	vent.on('map:themeLayer:show',function(colName){
		console.log('redraw mapView parcels based on layer:'+colName);
		mapView.currentLayer = colName;
		mapView.showLayer(colName);
	})
	//Listen to events changing map background
	//Triggered by mapLayerControlView only
	vent.on('map:background:show',function(layerName){
		//@param layername -> string value "street" || "satellite"
		mapView.toggleBackground(layerName);
	})

	return new MapView();
})
