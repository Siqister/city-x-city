define([
	'backbone',
	'marionette',
	'underscore',

	'vent',

	'app/collections/cityCollection',

	'text!app/templates/cityItemView.html'
],function(
	Backbone,
	Marionette,
	_,

	vent,

	cityCollection,

	cityItemViewTemplate
){

	var CityItemView = Marionette.ItemView.extend({
		className:'city-list-item',
		tagName:'li',

		template:_.template(cityItemViewTemplate),

		ui:{
			actionMenu:'.city-action-menu',
			addAsset:'.add-action .add-asset',
			addInvestment:'.add-action .add-investment'
		},
		events:{
			'mouseenter':function(){
				vent.trigger('city:hover', this.model.get('city'));
			},
			'mouseleave':function(){
				vent.trigger('city:unhover', this.model.get('city'));
			},
			'click':'onClick',
			'click @ui.addAsset':'addNewItem',
			'click @ui.addInvestment':'addNewItem'
		},

		initialize:function(){
			this.listenTo(this.model,'hover',this.onHover,this);
			this.listenTo(this.model,'unhover',this.onUnhover,this);
			this.listenTo(this.model,'change',this.onModelAttrChange,this);
		},
		onRender:function(){
			this.ui.actionMenu.hide();
		},
		onClick:function(){
			vent.trigger('city:click', this.model); //triggers cityCollectionView.showCityDetail
			vent.trigger('map:pan:city', this.model); //triggers mapView.panTo

			this.ui.actionMenu.fadeIn();

		},
		onHover:function(){
			this.$el.addClass('highlight');
		},
		onUnhover:function(){
			this.$el.removeClass('highlight');
		},
		onModelAttrChange:function(){
			var that = this;
			that.$el.find('.marked').html(that.model.get('marked'));
			that.$el.find('.city-owned').html(that.model.get('city_owned'));
			that.$el.find('.partner-owned').html(that.model.get('partner_owned'));
		},
		collapse:function(){
			this.ui.actionMenu.fadeOut().hide();
		},
		addNewItem:function(e){
			e.stopPropagation();

			var that = this;
			that.ui.actionMenu.find('.btn').removeClass('active');
			$(e.target).addClass('active');

			//trigger editing mode
			vent.trigger('map:edit:add',{
				xy:[e.pageX,e.pageY],
				cityModel:that.model,
				type:$(e.target).attr('id')
			}); //TODO: figure out the precise location

			vent.trigger('ui:hide:detail');
		}
	})

	var CityCollectionView = Marionette.CollectionView.extend({
		className:'city-list',
		tagName:'ul',
		childView:CityItemView,


		initialize:function(){
			console.log('cityCollectionView:init');

			this.collection.fetch({reset:true});
		},
		onRender:function(){
			var that = this,
				top = 0, spacing = 45;

			//Position .city-list-item
			that.children.forEach(function(childView){
				childView.$el.css({
					height:'100px',
					top:top+'px'
				});

				top += spacing;
			});
		},
		showCityDetail:function(cityModel){
			//Find particular childView 
			var cityDetailView = this.children.findByModel(cityModel);
			var that = this,
				top = 0, spacing = 45, z = 999;

			//reshuffle .city-list-item and reset z-index
			this.children.forEach(function(childView){
				if(childView.cid == cityDetailView.cid){
					return;
				}

				childView.$el
					.css('z-index',z)
					.animate({
						top:top+'px'
					});
				top += spacing;
				z += 1;
			},'fast');

			cityDetailView.$el
				.css({
					'z-index':9999
				})
				.animate({
					top:top+'px',
					height:(that.$el.height()-top+100)+'px'
				})
		}
	});

	var cityCollectionView = new CityCollectionView({collection:cityCollection});

	vent.on('cityCollection:update',function(){
		cityCollectionView.render();
	});
	vent.on('city:hover',function(name){
		var cityModel = (cityCollection.where({city:name}))[0];

		cityModel.trigger('hover');
	});
	vent.on('city:unhover',function(name){
		var cityModel = (cityCollection.where({city:name}))[0];

		cityModel.trigger('unhover');
	});
	vent.on('city:click',function(cityModel){
		cityCollectionView.children.each(function(view){
			view.collapse();
		})

		cityCollectionView.showCityDetail(cityModel);
	})


	return cityCollectionView;
})