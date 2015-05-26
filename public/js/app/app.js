define([
	'backbone',
	'underscore',
	'marionette'
],function(
	Backbone,
	_,
	Marionette
){
	var app = new Marionette.Application();

	//much more lightweight now
	//http://marionettejs.com/docs/v2.4.1/marionette.application.html#getting-started
	app.on('before:start',function(){
		console.log('app:before:start');
	});
	app.on('start',function(){
		console.log('app:start');

		if(Backbone.history){
			Backbone.history.start();
		}
	})

	return app;
})