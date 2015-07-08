define([
	'backbone'
],function(
	Backbone
){
	var InvestmentModel = Backbone.Model.extend({
		urlRoot:'/investment',
		defaults:{
			type:'investment'
		}
	})
	
	return InvestmentModel;
})