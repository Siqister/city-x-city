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
		},
		onRender:function(){
			var that = this;

			this.$el.on('mouseenter',function(){
				vent.trigger('city:hover', that.model.get('city'));
			})
			this.$el.on('mouseleave',function(){
				vent.trigger('city:unhover', that.model.get('city'));
			})
		},
		onHover:function(){
			this.$el.addClass('highlight');
		},
		onUnhover:function(){
			this.$el.removeClass('highlight');
		}
	})

	var CityCollectionView = Marionette.CollectionView.extend({
		className:'city-list',
		tagName:'ul',
		childView:CityItemView,

		initialize:function(){
			console.log('cityCollectionView:init');

			this.collection.fetch();
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


	return cityCollectionView;
})