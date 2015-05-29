define([
	'marionette',
	'leaflet',
	'd3'
],function(
	Marionette,
	L,
	d3
){

	var map;

	var MapView = Marionette.ItemView.extend({
		className:'map-inner',
		template:false,

		onShow:function(){
			map = L.map(this.el).setView([42.3, -71.8], 9);
			L.tileLayer('https://a.tiles.mapbox.com/v4/siqizhu01.map-8r4ecoz0/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic2lxaXpodTAxIiwiYSI6ImNiY2E2ZTNlNGNkNzY4YWYzY2RkMzExZjhkODgwMDc5In0.3PodCA0orjhprHrW6nsuVw')
				.addTo(map);
		}
	});

	return new MapView();
})