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

		initialize:function(){
			this.listenTo(this.model,'hover',this.onHover,this);
			this.listenTo(this.model,'unhover',this.onUnhover,this);
			this.listenTo(this.model,'change',this.onModelAttrChange,this);
		},
		onRender:function(){
			var that = this;

			this.$el.on('mouseenter',function(){
				vent.trigger('city:hover', that.model.get('city'));
			})
			this.$el.on('mouseleave',function(){
				vent.trigger('city:unhover', that.model.get('city'));
			})
			this.$el.on('click',function(){
				vent.trigger('city:click', that.model);
			})
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
		cityCollectionView.showCityDetail(cityModel);
	})


	return cityCollectionView;
})