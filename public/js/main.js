require.config({
	paths:{
		'jquery':'lib/jquery/jquery-1.11.3.min',
		'underscore':'lib/underscore/underscore-min',
		'marionette':'lib/marionette/backbone.marionette.min',
		'backbone':'lib/backbone/backbone-min',
		'leaflet':'lib/leaflet/leaflet',
		'd3':'lib/d3/d3.min'
	},
	shim:{
		'leaflet':{
			exports:'L'
		}
	}
});

require([
		'jquery',
		'underscore',
		'marionette',
		'backbone',
		'leaflet',
		'd3',

		'app/app'
	],function(
		$,
		_,
		Marionette,
		Backbone,
		L,
		d3,

		app
	){

		app.start();
	})