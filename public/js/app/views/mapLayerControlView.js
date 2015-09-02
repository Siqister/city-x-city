define([
	'marionette',
	'underscore',
	'd3',

	'vent'
],function(
	Marionette,
	_,
	d3,

	vent
){
	var config = [
		{name:'Ownership', options:[
			{name:"Publicly Owned"},
			{name:"Partner-Controlled"}
		]},
		{name:'Vacancy', options:[
			{name:"Ground floor vacancy"},
			{name:"Upper floor vacancy"},
			{name:"Total vacancy"}
		]}
	];

	var MapLayerControlView = Marionette.ItemView.extend({
		className:'map-layer-control-inner',
		tagName:'ul',
		template:false,

		render:function(){
			var _el = d3.select(this.el);

			//Add a heading
			_el.append('li')
				.attr('class','menu-item heading')
				.html('MAP LAYERS <span class="glyphicon glyphicon-menu-right"></span>');

			//custom render function to add dropdown menu groups
			config.forEach(function(menuItem){
				var _li = _el.append('li')
					.attr('class','menu-item option dropdown');

				_li.append('a')
					.html(menuItem.name)
					.attr('class','dropdown-toggle')
					.attr('data-toggle','dropdown')
					.attr('href','#');

				var _dropdown = _li.append('ul')
					.attr('class', 'dropdown-menu');

				menuItem.options.forEach(function(menuItemOption){
					_dropdown.append('li')
						.append('a')
						.attr('href','#')
						.html(menuItemOption.name);
				})
			});
		}


	});

	return MapLayerControlView;
})