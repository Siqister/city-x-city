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
			console.log('Validate:investmentModel');


			var errors = [],
				dateRegex = new RegExp("[0-9][0-9]/[0-9][0-9][0-9][0-9]");

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
			if(!dateRegex.test(attr.date)){
				errors.push({
					errorCode:3,
					errorField:'date',
					errorMsg:"Invalid date"
				})
			}

			if(errors.length>0){
				console.log(errors);
				return errors;
			}else{
				console.log("investmentModel:validate:success");
				console.log(attr);
			}
		}
	})
	
	return InvestmentModel;
})