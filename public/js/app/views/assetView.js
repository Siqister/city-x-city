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
			delete:'.delete',
			hiddenInputs:'.attr-list-item-hide-input'
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
			this.form_element = new Backbone.Form({
				model: this.model
			}).render();
			this.$el.append(this.form_element.el);
			this.ui.save.hide();
			this.ui.hiddenInputs.on('click',function(e){
				$(this).find('.value').hide();
				$(this).find('.form-control').show();
			})
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
			console.log(error);
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