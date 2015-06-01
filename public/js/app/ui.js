define([
	'jquery',
	'vent'
],function(
	$,
	vent
){
	var w = $('.content').width(),
		x = 0,
		pos = {},
		totalW = 0;

	var $detail = $('.content .detail');
	$detail.width(w*.2);
	pos.detail = x;
	x -= $detail.width();
	totalW += $detail.width();

	var $map = $('.content .map');
	$map.width(w);
	pos.map = x;
	x -= $map.width();
	totalW += $map.width();

	var $viz = $('.content .viz');
	$viz.width(w);
	pos.viz = x;
	totalW += $viz.width();

	var $modules = $('.content .modules');
	$modules.width(totalW);

	var ui = {
		pos:{
			init:function(){
				$modules.animate({'left':pos.map+'px'})
			},
			detail:function(){
				$modules.animate({'left':pos.detail+'px'})
			},
			map:function(){
				$modules.animate({'left':pos.map+'px'})
			},
			viz:function(){
				$modules.animate({'left':pos.viz+'px'})
			}
		}
	};

	vent.on('ui:pos:detail',ui.pos.detail)

	return ui;

})