define([
	'underscore',
	'marionette',
	'jquery',

	'vent',

	'text!app/templates/editView.html',

	//'bootstrap',
	'bootstrap-dropdown',
	'bootstrap-multiselect',
	'bootstrap-datepicker'
],function(
	_,
	Marionette,
	$,

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
				console.log('save');
				this.model.save();
			},
			'click @ui.cancel': 'removeNewItem',
			'change input': 'onAttrChange'
		},

		initialize:function(){
			this.listenTo(this.model,'sync',this.onModelSync,this);
			this.listenTo(this.model,'invalid',this.onModelError,this);
		},
		onShow:function(){
			var that = this;

			this.ui.save.hide();
			//initiate bootstrap multi
			this.$('#assetType').multiselect({
				onChange:function(option,checked,select){
					that.model.set('assetType',$(option).val());
					that.ui.save.fadeIn();
				}
			});
			this.$('#investmentType').multiselect({
				onChange:function(option,checked,select){
					that.model.set('investmentType',$(option).val());
					that.ui.save.fadeIn();
				}
			});

			//instantiate bootstrap datepicker
			this.$('.date input').datepicker({
				format:'mm/yyyy'
			})
		},
		onAttrChange:function(){
			console.log('input:changed');

			var that = this;
			that.ui.save.fadeIn();

			//change model attributes
			that.$('.form-group').each(function(i){
				$(this).removeClass('error');
				$(this).find('.error-msg').empty();

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
			vent.trigger('edit:cancel'); //layoutView
			vent.trigger('map:edit:remove'); //mapView will remove the editMarker

			//Depending on the type of the model (asset/investment), trigger mapView event to add the marker
			vent.trigger('map:add:item',this.model); 
		},
		onModelError:function(model,errors){
			var $formGroups = this.$('.form-group');

			errors.forEach(function(err){

				var $errorFields = $formGroups.filter(function(){
					return $(this).hasClass(err.errorField);
				});

				$errorFields.addClass('error');
				$errorFields.find('.error-msg').html(err.errorMsg);

			})
		}
	});

	return EditView;
})