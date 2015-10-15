define([
	'backbone',
	'marionette',
	'underscore',
	'd3',

	'vent',
	'app/ui',

	'app/collections/cityCollection',

	'app/views/viz/cityItemVizView',
	'app/views/viz/summaryView',

	'text!app/templates/cityItemView.html'
],function(
	Backbone,
	Marionette,
	_,
	d3,

	vent,
	ui,

	cityCollection,

	CityItemVizView,
	SummaryView,

	cityItemViewTemplate
){

	var inGridView = false;

	var CityItemView = Marionette.LayoutView.extend({
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
		regions:{
			'viz':'.city-item-viz'
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
			if(!inGridView){
				vent.trigger('city:click', this.model); //triggers cityCollectionView.showCityDetail
				vent.trigger('map:pan:city', this.model); //triggers mapView.panTo

				this.ui.actionMenu.fadeIn();

				this.viz.show(new SummaryView({model:this.model}));
			}
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
			this.viz.empty();
		},
		addNewItem:function(e){
			e.stopPropagation();

			var that = this;
			that.ui.actionMenu.find('.btn').removeClass('active');
			$(e.target).addClass('active');

			//trigger editing mode in mapView
			vent.trigger('map:edit:add',{
				xy:[e.pageX,e.pageY],
				cityModel:that.model,
				type:$(e.target).attr('id')
			}); //TODO: figure out the precise location

			vent.trigger('ui:hide:detail');
		},

		expandDetail:function(){
			this.viz.empty();
			this.viz.show(new CityItemVizView({model:this.model}));
		},

		hideDetail:function(){
			this.viz.empty();
			this.viz.show(new SummaryView({model:this.model}));
		}
	})

	var CityCollectionView = Marionette.CollectionView.extend({
		className:'city-list',
		tagName:'ul',
		childView:CityItemView,

		targetPos: null,


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
		expandCityDetail:function(cityModel){
			if(inGridView){ return; } //noop if in gridView

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
		},

		gridView:function(){
			//disable gridView if already in grid
			if(inGridView){ return; }

			var that = this;
			that.$el.addClass('grid');

			that.targetPos = d3.map(); //holds old mapView coordinates
			inGridView = true;

			var x = 5, y = 2, padding = 0;
			var width = ui.getContentSize().width,
				height = ui.getContentSize().height;

			var w = (width - (x+1)*padding)/x,
				h = (height - (y+1)*padding)/y;

			that.children.forEach(function(childView,i){
				var xPos = padding + (i%x)*(w+padding),
					yPos = padding + Math.floor(i/x)*(h+padding);

				that.targetPos.set(childView.cid,{
					left: childView.$el.css('left'),
					top: childView.$el.css('top'),
					w: childView.$el.outerWidth(),
					h: childView.$el.outerHeight(),
					z: childView.$el.css('z-index')
				});

				childView.$el.animate({
					left:xPos+'px',
					top:yPos+'px',
					width:w+'px',
					height:h+'px'
				},'fast',function(){
					childView.expandDetail();
				});

			});


		},

		mapView:function(){
			//disable mapView if already in mapView
			if(!inGridView){return;}

			var that = this;
			that.$el.removeClass('grid');

			this.children.forEach(function(childView){
				var pos = that.targetPos.get(childView.cid);

				childView.$el
					.css({
						'z-index': pos.z
					})
					.animate({
						left:0,
						top:pos.top,
						width:pos.w+'px',
						height:pos.h+'px'
					},'fast',function(){
						childView.hideDetail();
					});
			});

			that.targetPos = null;
			inGridView = false;
		}

	});

	var cityCollectionView = new CityCollectionView({collection:cityCollection});

	vent.on('cityCollection:update',function(){	cityCollectionView.render();	});
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

		cityCollectionView.expandCityDetail(cityModel);
	});

	vent.on('cityCollectionView:expand', function(){ cityCollectionView.gridView(); });
	vent.on('cityCollectionView:collapse',function(){ cityCollectionView.mapView(); });


	return cityCollectionView;
})