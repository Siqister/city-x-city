define([
	'underscore',
	'marionette',

	'vent',

	'text!app/templates/investmentView.html',

	'bootstrap-dropdown'
],function(
	_,
	Marionette,

	vent,

	investmentViewTemplate
){
	var InvestmentView = Marionette.ItemView.extend({
		className:'investment-inner detail-inner',
		template:_.template(investmentViewTemplate),
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
			this.listenTo(this.model,'invalid',this.onModelError, this);
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
		onModelError:function(model,err){
			console.log(err);
		}
	});

	return InvestmentView;
})