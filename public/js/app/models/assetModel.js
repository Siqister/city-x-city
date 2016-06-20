define([
	'backbone'
],function(
	Backbone
){
	var AssetModel = Backbone.Model.extend({
		schema: {
			name: 'Text',
      address: 'Text',
      contact: 'Text',
      employer: 'Checkbox',
      activating: 'Checkbox',
      assetType: {type: 'Select', options: ["Food","Business","Retail","Community","Cultural & Entertainment","Health Care","Education","Government ","Temporary","Park / Open Space","Parking","Public Transit"] },
      subtype: {type: 'Select', options: [{ "group": "Food",
																						    "options": 
																						    ["Grocery",
																						      "Café",
																						      "Restaurant",
																						      "Fast-Food"]},
																						  {"group": "Business",
																						"options": 
																						  ["Hotel",
																						    "General Office ",
																						    "General Industrial",
																						    "Bank",
																						    "Coworking Space",
																						    "Corporation"]},
																						    {"group": "Retail",
																						"options": 
																						  ["Clothing",
																						    "Convenience ",
																						    "Pharmacy",
																						    "Household Goods",
																						    "Other Retail"]},
																						    {"group": "Community",
																						"options": 
																						  ["Community Center",
																						    "Non-Profit",
																						    "Groups or Associations",
																						    "Church"]},
																						    {"group": "Cultural & Entertainment",
																						"options": 
																						  ["Museum",
																						    "Theatre",
																						    "Indoor Recreation ",
																						    "Art Center / Gallery"]},
																						    {"group": "Health Care",
																						"options": 
																						  ["Hospital or Clinic",
																						    "Care and Treatment Facility",
																						    "Medical Office"]},
																						    {"group": "Education",
																						"options": 
																						  ["K - 12",
																						    "Higher Ed",
																						    "Community College",
																						    "Vocational School"]},
																						    {"group": "Government ",
																						"options": 
																						  ["Police ",
																						    "Fire",
																						    "Library",
																						    "City Govt",
																						    "Other Govt Dept and Agencies",
																						    "Post Office"]},
																						    {"group": "Temporary",
																						"options": 
																						  ["Placemaking Initiative",
																						    "Farmers Market",
																						    "Event Location"]},
																						    {"group": "Park / Open Space",
																						"options": 
																						  ["Green Space",
																						    "Plaza",
																						    "Alleyway",
																						    "Community Garden / Farm"]},
																						    {"group": "Parking",
																						"options": 
																						  ["Garage"]},
																						  { "group": "Public Transit",
																						"options": [] 
																					}]},
      comments: 'TextArea'
		},
		urlRoot:'/asset',
		idAttribute:'cartodb_id',
		defaults:{
			type:'asset',
			assetType:'Food',
			employer:false,
			employee:0,
			parking:0,
			activating: false,
			subtype: ''
		},
		validate:function(attr,options){
			var errors = [];

			if(!attr.name){
				errors.push({
					errorCode:2,
					errorField:'name',
					errorMsg:"A name is required."
				})
			}

			if(errors.length>0){return errors;}
		}
	});
	
	return AssetModel;
});