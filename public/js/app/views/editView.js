define([
	'underscore',
	'marionette',
	'jquery',

	'vent',

	'text!app/templates/editView.html',

	//'bootstrap',
	'bootstrap-dropdown',
	'bootstrap-multiselect',
	'bootstrap-datepicker',
	'bootstrap-switch'
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
			employer:'.employer input',
			activating: '.activating input',
			cancel:'.close',
			save:'.save'
		},
		events:{
			'click @ui.save': function(){
				console.log('save');
				this.model.save();
			},
			'click @ui.cancel': 'removeNewItem',
			'change input': 'onAttrChange',
			'switchChange.bootstrapSwitch @ui.employer':'onAttrChange',
			'switchChange.bootstrapSwitch @ui.activating':'onAttrChange',
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

					if($(option).val()=='parking'){
						//if asset type is parking, hide and reset employment
						that.$('.parking').show();

						that.$('.employment').hide();
						that.ui.employer.bootstrapSwitch('state',false);
						that.$('#employee').val(0);
					}else{
						//otherwise, hide and reset parking, show employment
						that.$('.parking').hide();
						that.$('#parking').val(0);

						that.$('.employer').show();
					}
				}
			});
			this.$('#investmentType').multiselect({
				onChange:function(option,checked,select){
					that.model.set('investmentType',$(option).val());
					that.ui.save.fadeIn();
				}
			});

			//initiate bootstrap switch
			this.ui.employer.bootstrapSwitch({
				size:'small',
				onText:'Yes',
				offText:'No'
			});

			this.ui.activating.bootstrapSwitch({
				size:'small',
				onText:'Yes',
				offText:'No'
			});
			//instantiate bootstrap datepicker
			this.$('.date input').datepicker({
				format:'mm/yyyy'
			});


			//Hide/show logic
			this.ui.employer.on('switchChange.bootstrapSwitch',function(e,state){
				if(state == true){that.$('.employee').show();}
				else{that.$('.employee').hide();}
			})

			// this.ui.activating.on('switchChange.bootstrapSwitch',function(e,state){
			// 	if(state == true){that.$('.activating').show();}
			// 	else{that.$('.activating').hide();}
			// })
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

			//deal with bootstrap switch separately
			var employer = that.ui.employer.bootstrapSwitch('state');
			that.model.set('employer',employer);

			var activating = that.ui.activating.bootstrapSwitch('state');
			that.model.set('activating',activating);

			console.log(that.model);
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