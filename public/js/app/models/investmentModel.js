define([
	'backbone'
],function(
	Backbone
){
	var InvestmentModel = Backbone.Model.extend({
		urlRoot:'/investment',
		idAttribute:'cartodb_id',
		defaults:{
			type:'investment',
			investmentType:'equity'
		},
		validate:function(attr,options){
			var errors = [];

			if(isNaN(attr.value)){
				errors.push({
					errorCode:1,
					errorField:'value',
					errorMsg:"Investment value is not a number."
				})
			}
			if(!attr.name){
				errors.push({
					errorCode:2,
					errorField:'name',
					errorMsg:"A name is required."
				})
			}

			if(errors.length>0){return errors;}
		}
	})
	
	return InvestmentModel;
})