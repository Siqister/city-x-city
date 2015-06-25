define([
	'jquery',
	'vent'
],function(
	$,
	vent
){
	var $detail = $('.content .detail');

	var ui = {
		detail:{
			show:function(){
				$detail.animate({
					'top':'0px',
					'opacity':1
				})
			},
			hide:function(){
				$detail.animate({
					'top':'100px',
					'opacity':0
				})
			}
		}
	};

	vent.on('ui:show:detail',ui.detail.show)

	return ui;

})