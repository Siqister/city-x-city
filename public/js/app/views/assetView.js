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
			save:'.save'
		},
		events:{
			'click @ui.save': function(){
				this.model.save(); //Issues a PUT request
			},
			'click @ui.cancel': function(){
				vent.trigger('ui:hide:detail');
			},
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
		}
	});

	return AssetView;
})