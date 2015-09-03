define([
	'marionette',
	'underscore',
	'd3',

	'vent',

	'config'
],function(
	Marionette,
	_,
	d3,

	vent,

	config
){

	var mapLayerConfig = config.mapLayers;

	var MapLayerControlView = Marionette.ItemView.extend({
		className:'map-layer-control-inner',
		tagName:'ul',
		template:false,
		ui:{
			'layerOption':'.option .dropdown-toggle'
		},
		events:{
			'click @ui.layerOption':function(e){
				var cartodbCol = $(e.target).data('col');
				vent.trigger('map:themeLayer:show',cartodbCol); //recolor map parcel layer based on different cartodb columns
			}
		},

		render:function(){
			var _el = d3.select(this.el);

			//Add a heading
			_el.append('li')
				.attr('class','menu-item heading')
				.html('MAP LAYERS <span class="glyphicon glyphicon-menu-right"></span>');

			//custom render function to add dropdown menu groups
			mapLayerConfig.forEach(function(menuItem){
				var _li = _el.append('li')
					.attr('class','menu-item option dropdown');

				_li.append('a')
					.html(menuItem.name)
					.attr('class','dropdown-toggle')
					.attr('data-toggle','dropdown')
					.attr('data-col',menuItem.cartodbCol)
					.attr('href','#');

				var _dropdown = _li.append('ul')
					.attr('class', 'dropdown-menu');

				menuItem.options.forEach(function(menuItemOption){
					var legendItem = _dropdown.append('li')
						.append('a')
						.attr('href','#')
						.html('<span class="legend"></span>'+menuItemOption.name);

					legendItem.select('.legend')
						.style('background',menuItemOption.color);

				})
			});
		}


	});

	return MapLayerControlView;
})