define([
	'underscore',
	'marionette',

	'vent',

	'text!app/templates/editView.html',

	'bootstrap-dropdown'
],function(
	_,
	Marionette,

	vent,

	editViewTemplate
){
	var EditView = Marionette.ItemView.extend({
		className:'edit-inner',
		template:_.template(editViewTemplate),
		ui:{
			cancel:'.close',
			save:'.save'
		},
		events:{
			'click @ui.save': function(){
				this.model.save();
			},
			'click @ui.cancel': 'removeNewItem',
			'input': 'onAttrChange'
		},

		initialize:function(){
			this.listenTo(this.model,'sync',this.onModelSync,this);
		},
		onShow:function(){
			this.ui.save.hide();
		},
		onAttrChange:function(){
			var that = this;
			that.ui.save.fadeIn();

			//change model attributes
			that.$('.form-group').each(function(i){
				var $input = $(this).find('.form-control');
				var attr = $input.attr('id'),
					val = $input.val();
				
				that.model.set(attr,val);
			});

		},
		removeNewItem:function(){
			vent.trigger('map:edit:remove'); //mapView will remove marker
			vent.trigger('edit:cancel'); //layoutView will empty the edit region

			if(this.model.get('type')=='asset'){
				vent.trigger('assetCollection:remove',this.model);
			}else{
				vent.trigger('investmentCollection:remove',this.model);
			}
		},
		onModelSync:function(){
			//model has been saved to database, remove this view;
			console.log(this.model);
			vent.trigger('edit:cancel');
		}
	});

	return EditView;
})