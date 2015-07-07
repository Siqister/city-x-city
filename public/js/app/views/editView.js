define([
	'underscore',
	'marionette',

	'vent',

	'text!app/templates/editView.html',

	'bootstrap'
],function(
	_,
	Marionette,

	vent,

	editViewTemplate
){
	var EditView = Marionette.ItemView.extend({
		className:'edit-inner',
		template:_.template(editViewTemplate),

		initialize:function(){
		},
		onRender:function(){
			this.$('.dropdown').dropdown();
		}
	});

	return EditView;
})