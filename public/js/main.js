require.config({
	paths:{
		'jquery':'lib/jquery/jquery-1.11.3.min',
		'underscore':'lib/underscore/underscore-min',
		'marionette':'lib/marionette/backbone.marionette.min',
		'backbone':'lib/backbone/backbone-min',
		'leaflet':'lib/leaflet/leaflet',
		'd3':'lib/d3/d3.min',
		'text':'lib/require/text',

		'vent':'app/vent',

		'bootstrap-dropdown':'lib/bootstrap/js/dropdown',
		'bootstrap-switch':'lib/bootstrap-switch/bootstrap-switch.min',
		'bootstrap-multiselect':'lib/bootstrap-multiselect/bootstrap-multiselect',
		'bootstrap-datepicker':'lib/bootstrap-datepicker/bootstrap-datepicker.min',
		'bootstrap':'lib/bootstrap/dist/js/bootstrap.min',
		'config':'config',
		'backbone-forms': 'lib/backbone-forms/backbone-forms.min'
	},
	shim:{
		'leaflet':{
			exports:'L'
		},
		'bootstrap-switch':{
			deps:['jquery']
		},
		'bootstrap-dropdown':{
			deps:['jquery']
		},
		'bootstrap-multiselect':{
			deps:['jquery']
		},
		'bootstrap-datepicker':{
			deps:['jquery']
		},
		'backbone-forms': {
			deps: ['backbone']
		}
	}
});

require([
		'jquery',
		'underscore',
		'marionette',
		'backbone-forms',
		'backbone',
		'leaflet',
		'd3',

		'app/app',
		'app/ui'
	],function(
		$,
		_,
		Marionette,
		Backbone,
		backboneforms,
		L,
		d3,

		app,
		ui
	){
		app.start();
	})