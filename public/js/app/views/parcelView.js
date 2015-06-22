define([
	'backbone',
	'marionette',
	'underscore',

	'text!app/templates/parcelView.html'
],function(
	Backbone,
	Marionette,
	_,

	parcelViewTemplate
){

	var ParcelView = Marionette.ItemView.extend({
		className:'detail-inner',
		template:_.template(parcelViewTemplate),

		ui:{
			comment: '.comment input',
			save: '.save'
		},
		events:{
			'change @ui.comment':'commentChanged',
			'click @ui.save':'saveChanges'
		},

		commentChanged:function(e){
			this.model.set({
				comment:$(e.target).val(),
				modified:true
			});
		},
		saveChanges:function(){
			this.model.save(); //issues HTTP PUT request
		}
	})

	return ParcelView;
})