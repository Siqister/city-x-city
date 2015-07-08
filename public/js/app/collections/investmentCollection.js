define([
	'backbone',

	'vent',

	'app/models/investmentModel'
],function(
	Backbone,

	vent,

	InvestmentModel
){
	var InvestmentCollection = Backbone.Collection.extend({
		url:'/investment',
		model:InvestmentModel
	});

	var investmentCollection = new InvestmentCollection();

	vent.on('investmentCollection:add',function(model){
		investmentCollection.add(model);
	})
	vent.on('investmentCollection:remove',function(model){
		investmentCollection.remove(model);
		console.log(investmentCollection);
	})

	return investmentCollection;
})