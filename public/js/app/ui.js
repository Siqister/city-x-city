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
				$detail.css({
					"pointer-events": "all"
				});
				$detail.animate({
					'top':'0px',
					'opacity':1
				})
			},
			hide:function(){
				$detail.css({
					"pointer-events": "none"
				});
				$detail.animate({
					'top':'100px',
					'opacity':0
				},function(){
					console.log('ui:detail:hide:animationComplete');
					vent.trigger('ui:detail:hide:animationComplete');
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
		},
		getContentSize:function(){
			return {
				width:$('.content').width(),
				height:$('.content').height()
			}
		}
	};

	$(window).on('resize', function(){
		height = $('.content').height();
	})

	vent.on('ui:show:detail',ui.detail.show);
	vent.on('ui:hide:detail',ui.detail.hide);
	vent.on('ui:edit:hide',ui.edit.hide);
	vent.on('ui:edit:reposition',ui.edit.reposition);
	vent.on('ui:edit:show',ui.edit.show);

	return ui;

})