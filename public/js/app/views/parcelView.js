define([
	'backbone',
	'marionette',
	'underscore',

	'vent',

	'text!app/templates/parcelView.html'
],function(
	Backbone,
	Marionette,
	_,

	vent,

	parcelViewTemplate
){

	var ParcelView = Marionette.ItemView.extend({
		className:'detail-inner',
		template:_.template(parcelViewTemplate),

		ui:{
			comment: '.comment textarea',
			save: '.save'
		},
		events:{
			'input @ui.comment':'commentChanged',
			'click @ui.save':'saveChanges'
		},

		initialize:function(){
			this.listenTo(this.model,'sync',this.onSync);
		},
		onShow:function(){
			this.ui.save.hide();
		},
		onBeforeDestroy:function(){
			this.stopListening();
		},
		commentChanged:function(e){
			this.model.set({
				comment:$(e.target).val(),
				modified:true
			});

			this.$el.addClass('modified');
			this.ui.save.fadeIn();
		},
		saveChanges:function(){
			this.model.save(); //issues HTTP PUT request
		},
		onSync:function(){
			this.ui.save.fadeOut();
			this.$el.removeClass('modified');

			vent.trigger('parcel:update');
		}
	})

	return ParcelView;
})