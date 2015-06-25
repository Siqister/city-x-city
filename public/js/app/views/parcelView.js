define([
	'backbone',
	'marionette',
	'underscore',

	'vent',

	'text!app/templates/parcelView.html',

	'bootstrap-switch'
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
			marked: '.marked input',
			save: '.save'
		},
		events:{
			'input @ui.comment':'attrModified',
			'switchChange.bootstrapSwitch @ui.marked':'attrModified', //custom event associated with boostrap-switch
			'click @ui.save':'saveChanges',
		},

		initialize:function(){
			this.listenTo(this.model,'sync',this.onSync);

			console.log(this.model);
		},
		onShow:function(){
			//customize initial appearance
			this.ui.save.hide();
			this.ui.marked.bootstrapSwitch({
				size:'small',
				onText:'Marked',
				offText:'Mark'
			});
		},
		onBeforeDestroy:function(){
			this.stopListening();
		},
		attrModified:function(e,state){
			console.log('parcelDetail:attrModified');

			this.model.set({
				comment:this.ui.comment.val(),
				marked: this.ui.marked.bootstrapSwitch('state'),
				modified:true
			});

			console.log(this.model);

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