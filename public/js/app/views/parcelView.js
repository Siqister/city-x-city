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
		className:'detail-inner parcel-inner',
		template:_.template(parcelViewTemplate),

		ui:{
			address: '.address',
			comment: '.comment textarea',
			marked: '.marked input',
			cityOwned: '.city-owned input',
			partnerOwned: '.partner-owned input',
			vacancy: '.vacancy input',
			save: '.save',
			close:'.close'
		},
		events:{
			'input @ui.comment':'attrModified',
			'switchChange.bootstrapSwitch @ui.marked':'attrModified', //custom event associated with boostrap-switch
			'switchChange.bootstrapSwitch @ui.cityOwned':'attrModified',
			'switchChange.bootstrapSwitch @ui.partnerOwned':'attrModified',
			'click @ui.vacancy':'attrModified',
			'click @ui.save':'saveChanges',
			'click @ui.address':'zoomToParcel',
			'click @ui.close':function(){ vent.trigger('ui:hide:detail'); }
		},

		initialize:function(){
			this.listenTo(this.model,'sync',this.onSync);
		},
		onShow:function(){
			//customize initial appearance
			this.ui.save.hide();
			this.ui.marked.bootstrapSwitch({
				size:'small',
				onText:'Marked',
				offText:'Mark'
			});
			this.ui.cityOwned.bootstrapSwitch({
				size:'small',
				onText:'Yes',
				offText:'No'
			});
			this.ui.partnerOwned.bootstrapSwitch({
				size:'small',
				onText:'Yes',
				offText:'No'
			});
		},
		onBeforeDestroy:function(){
			this.stopListening();
		},
		attrModified:function(e,state){
			e.stopPropagation();

			var that = this,
				$target = $(e.target);

			//Parcels can't be both partner controlled and city owned
			if($(e.target).hasClass('city-owned') && state == true){
				if(that.ui.partnerOwned.bootstrapSwitch('state')==true){
					console.log('Conflict');
					that.ui.partnerOwned.bootstrapSwitch('state',false);
					//that.ui.partnerOwned.toggleState();
				}
			}else if($(e.target).hasClass('partner-owned') && state == true){
				if(that.ui.cityOwned.bootstrapSwitch('state')==true){
					console.log('Conflict');
					that.ui.cityOwned.bootstrapSwitch('state',false);
					//that.ui.cityOwned.toggleState();
				}
			}



			//Set behavior of vancancy checkbox input
			if($(e.target).hasClass('vacancy')){
				if(e.target.checked == true){
					$target.parent().addClass('active')
				}else{
					$target.parent().removeClass('active')
				}
			}

			var vacancyCode;
			if(that.$('#ground').prop('checked')==true){
				if(that.$('#upper').prop('checked')==true){
					vacancyCode = 3;
				}else{
					vacancyCode = 1;
				}
			}else if(that.$('#upper').prop('checked')==true){
				vacancyCode = 2;
			}else{
				vacancyCode = 0;
			}



			this.model.set({
				comment:this.ui.comment.val(),
				marked: this.ui.marked.bootstrapSwitch('state'),
				city_owned:this.ui.cityOwned.bootstrapSwitch('state'),
				partner_owned:this.ui.partnerOwned.bootstrapSwitch('state'),
				vacancy: vacancyCode,
				modified:true
			});

			//Add 'modified' class to this view
			//Show 'save' button
			this.$el.addClass('modified');
			this.ui.save.fadeIn();
		},
		saveChanges:function(){
			console.log('parcelModel:save:before');
			console.log(this.model);

			this.model.save(null,{
				error:function(model,res,op){
					console.log('parcelModel:save:ERROR');
				},
				success:function(model,res,op){
					console.log('parcelModel:save:Success');
				}
			}); //issues HTTP PUT request
		},
		onSync:function(){
			//parcel model is sync'ed up with server
			console.log('parcelView:onSync');
			this.ui.save.fadeOut();
			this.$el.removeClass('modified');

			vent.trigger('parcel:update'); //trips mapView.drawParcels and cityCollection.fetch
		},
		zoomToParcel:function(){
			vent.trigger('map:pan:parcel',this.model);
		}
	})

	return ParcelView;
})