define([
	'jquery',
	'vent'
],function(
	$,
	vent
){
	var $detail = $('.content .detail'),
		$edit = $('.content .edit');
	var height = $('.content').height();

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
		},
		edit:{
			show:function(xy){
				$edit.css({
					left:xy.x-140+'px',
					bottom:height-xy.y+25+'px'
				}).fadeIn('fast');
			},
			hide:function(){
				$edit.fadeOut().hide();
			},
			reposition:function(xy){
				$edit.css({
					left:xy.x-140+'px',
					bottom:height-xy.y+25+'px'
				}).fadeIn('fast');
			}
		}
	};

	vent.on('ui:show:detail',ui.detail.show);
	vent.on('ui:hide:detail',ui.detail.hide);
	vent.on('ui:edit:hide',ui.edit.hide);
	vent.on('ui:edit:reposition',ui.edit.reposition);
	vent.on('ui:edit:show',ui.edit.show);

	return ui;

})