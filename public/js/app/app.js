define([
	'backbone',
	'underscore',
	'marionette',
	'vent',

	'app/views/layoutView',

	'app/collections/cityCollection'
],function(
	Backbone,
	_,
	Marionette,
	vent,

	appLayoutView,

	cityCollection
){
	var app = new Marionette.Application({
		rootView: appLayoutView
	});

	var appController = {
		'showCity':function(city){

			//map should zoom to city, and mapCollection view should update
			//collection promise object from cityCollection
			//mapView.panTo
			cityCollection.deferred.done(function(){
				console.log('Hello world ' + city);
				var cityModels = cityCollection.where({city:city.toUpperCase()});

				if(cityModels.length==0){return;}
				else{
					console.log(cityModels[0])
					vent.trigger('map:pan:city',cityModels[0]);
					vent.trigger('city:click',cityModels[0]);
					//TODO:show extent
				}
			});

		}
	}

	var appRouter = new Marionette.AppRouter({
		controller: appController,
		appRoutes:{
			':city':'showCity' //showCity must exist in controller
		}
	});

	//much more lightweight now
	//http://marionettejs.com/docs/v2.4.1/marionette.application.html#getting-started
	app.on('before:start',function(){
		console.log('app:before:start');
	});
	app.on('start',function(){
		app.Router = appRouter;
		app.rootView.render();

		if(Backbone.history){
			Backbone.history.start();
		}
	})

	return app;
})