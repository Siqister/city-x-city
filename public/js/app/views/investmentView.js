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
			save:'.save',
			delete:'.delete',
			edit: '.edit-data',
			form: '.form-edit',
			show: '.form-show',
			hiddenInputs:'.attr-list-item-hide-input'
		},
		events:{
			'click @ui.save': function(){
				this.form_element.commit();
				this.model.save(); //Issues a PUT request
			},
			'click @ui.delete':function(){
				this.model.destroy();
			},
			'click @ui.cancel': function(){
				vent.trigger('ui:hide:detail');
			},
			'click @ui.edit': function() {
				this.ui.show.hide();
				this.ui.form.show();
			},
			'input': 'onAttrChange',
			'click input[type=checkbox]': 'onAttrChange'
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
			this.$el.find(".form-edit").append(this.form_element.el).hide();
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
		onModelError:function(model,err){
			console.log(err);
		},
		onModelDestroy:function(){
			console.log('investmentView:model:destroy');
			vent.trigger('ui:hide:detail'); //will also trigger layoutView.detail region to empty
			vent.trigger('investment:delete',this.model.id);
		}
	});

	return InvestmentView;
})