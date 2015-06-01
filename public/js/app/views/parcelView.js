define([
	'backbone',
	'marionette'
],function(
	Backbone,
	Marionette
){
	var ParcelView = Marionette.ItemView.extend({
		className:'detail-inner',
		template:false,

	})

	return ParcelView;
})