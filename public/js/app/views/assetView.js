define([
	'underscore',
	'marionette',

	'vent',

	'text!app/templates/assetView.html',

	'bootstrap-dropdown'
],function(
	_,
	Marionette,

	vent,

	assetViewTemplate
){
	var AssetView = Marionette.ItemView.extend({
		className:'asset-inner detail-inner',
		template:_.template(assetViewTemplate),
		ui:{
			cancel:'.close',
			save:'.save',
			delete:'.delete'
		},
		events:{
			'click @ui.save': function(){
				this.model.save(); //Issues a PUT request
			},
			'click @ui.cancel': function(){
				vent.trigger('ui:hide:detail');
			},
			'click @ui.delete': function(){
				this.model.destroy();
			},
			'input': 'onAttrChange'
		},

		initialize:function(){
			this.listenTo(this.model,'sync',this.onModelSync,this);
			this.listenTo(this.model,'invalid',this.onModelError, this);
			this.listenTo(this.model,'destroy',this.onModelDestroy,this);
		},
		onShow:function(){
			this.ui.save.hide();
		},
		onAttrChange:function(){
			var that = this;
			that.$el.addClass('modified');
			that.ui.save.fadeIn();

			//change model attributes
			that.$('.form-group').each(function(i){
				var $input = $(this).find('.form-control');
				var attr = $input.attr('id'),
					val = $input.val();
				
				that.model.set(attr,val);
			});

		},
		onModelSync:function(){
			this.ui.save.fadeOut();
			this.$el.removeClass('modified');
		},
		onModelError:function(model,error){

		},
		onModelDestroy:function(){
			console.log('assetView:model:destroy');
			vent.trigger('ui:hide:detail'); //will also trigger layoutView.detail region to empty
			console.log('Destroyed model ID:'+this.model.id);
			vent.trigger('asset:delete',this.model.id);
		}
	});

	return AssetView;
})