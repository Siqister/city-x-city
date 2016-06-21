define([
	'underscore',
	'marionette',
	'jquery',
	'd3',
	'vent',

	'text!app/templates/editView.html',
	'config',
	//'bootstrap',
	'bootstrap-dropdown',
	'bootstrap-multiselect',
	'bootstrap-datepicker',
	'bootstrap-switch'

],function(
	_,
	Marionette,
	$,
	d3,
	vent,

	editViewTemplate,
	config
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

			//draw asset type form from data
			var assetTypes = d3.select("#assetType");
			assetTypes.selectAll("option")
				.data(config.assetTypes)
				.enter()
				.append("option")
				.attr("value", function(data) {
					return data.category;
				})
				.attr("id", function(data) {
					return data.css + "-type";
				})
				.text(function(data) {
					return data.category;
				});

			var assetSubtypes = d3.select("#assetSubtypes")
				.selectAll("li")
				.data(config.assetTypes)
				.enter()
				.append("li")
				.attr("class", function(d) {
					if (d.category == "Food") {
						return d.css + "-type selected attr-list-item multi-select";
					}  else {
						return d.css + "-type attr-list-item multi-select";	
					}
					
				})
				.attr("style", function(d) {
					if (d.category == "Food") {
						return "display: block";
					} else {
						return "display: none;";
					}
				})
				.append("select")
				.attr("class", function(d) {
					if (d.category == "Food") {
						return d.css + "-type form-control assetSubtype";
					} else {
						return d.css + "-type form-control assetSubtype";	
					}

				})
				.attr("id", function(d) {
					return d.css + "-type";
				});

			assetSubtypes.append("option").attr("value", "");

			assetSubtypes.selectAll("option")
				.data(function(d) {
					console.log(d);
					return d.subcategories;
				})
				.enter()
				.append("option")
				.attr("value", function(d) { return d; })
				.text(function(d) { return d; });

			this.$(".selected select.assetSubtype").change(function() {
				 var subtype = $("#assetSubtypes li.selected .Food-type").find(":selected").first().text();
				 that.model.set("subtype", subtype);
			});

			//initiate bootstrap multi
			this.$('#assetType').multiselect({
				onChange:function(option,checked,select){
					that.model.set('assetType',$(option).val());
					that.ui.save.fadeIn();

					// $(".assetSubtype").multiselect();
					$("#assetSubtypes li").hide().removeClass("selected");
					$("." + $(option).attr('id')).show().addClass("selected");

					that.$(".selected select.assetSubtype ").change(function() {
						var subtype = $("#assetSubtypes li.selected ." + $(option).attr('id')).find(":selected").first().text();
						that.model.set("subtype", subtype);
					});


					if($(option).val()=='Parking'){
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

			this.$('.date-feature input').datepicker({
				format:'yyyy-mm-dd'
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