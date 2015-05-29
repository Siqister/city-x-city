define([
	'backbone',
	'underscore',
	'marionette',

	'app/views/layoutView'
],function(
	Backbone,
	_,
	Marionette,

	appLayoutView
){
	var app = new Marionette.Application({
		rootView: appLayoutView
	});

	//much more lightweight now
	//http://marionettejs.com/docs/v2.4.1/marionette.application.html#getting-started
	app.on('before:start',function(){
		console.log('app:before:start');
	});
	app.on('start',function(){
		app.rootView.render();

		if(Backbone.history){
			Backbone.history.start();
		}
	})

	return app;
})