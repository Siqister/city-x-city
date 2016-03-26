define([],function(){
	var config = {};

	config.mapLayers = [
		{
			name:'Ownership', 
			options:[
				{name:"Publicly Owned",color:'#de2d26'},
				{name:"Partner-Controlled",color:'#2c7fb8'}
			]
		},
		{
			name:'Vacancy',
			cartodbCol: 'vacancy',
			options:[
				{name:"Ground floor",cartodbVal:1,color:'red'},
				{name:"Upper floor",cartodbVal:2,color:'blue'},
				{name:"Total vacancy",cartodbVal:3,color:'purple'}
			],
			defaults:{
				color:'white'
			}
		},
		{
			name:'Land Use',
			cartodbCol: 'tdi_land_use',
			options:[
				{name:"Residential",cartodbVal:'1',color:'yellow'},
				{name:"Commercial",cartodbVal:'3',color:'red'},
				{name:"Industrial",cartodbVal:'4',color:'purple'},
				{name:"Institutional, Other, or Unknown",cartodbVal:'9',color:'rgb(180,180,180)'}
			],
			defaults:{
				color:'white'
			}
		},
		{
			name:'For Sale',
			cartodbCol:'tdi_for_sale',
			options:[
				{name:"For Sale",cartodbVal:true,color:'red'}
			],
			defaults:{
				color:'white'
			}
		},
		{
			name:'For Lease',
			cartodbCol:'tdi_for_lease',
			options:[
				{name:"For Lease",cartodbVal:true,color:'red'}
			],
			defaults:{
				color:'white'
			}
		}
	];

	config.mapBackground = [
		{name:'Street', layer:'street'},
		{name:'Satellite', layer:'satellite'}
	];

	config.assetTypes = [{ "category": "Food",
												"css": "Food",
											    "subcategories": 
											    ["Grocery",
											      "Café",
											      "Restaurant",
											      "Fast-Food"]},
											  {"category": "Business",
					  								"css": "Business",
											"subcategories": 
											  ["Hotel",
											    "General Office ",
											    "General Industrial",
											    "Bank",
											    "Coworking Space",
											    "Corporation"]},
											    {"category": "Retail",
					    								"css": "Retail",
											"subcategories": 
											  ["Clothing",
											    "Convenience ",
											    "Pharmacy",
											    "Household Goods",
											    "Other Retail"]},
											    {"category": "Community",
					    								"css": "Community",
											"subcategories": 
											  ["Community Center",
											    "Non-Profit",
											    "Groups or Associations",
											    "Church"]},
											    {"category": "Cultural & Entertainment",
					    								"css": "Cultural",
											"subcategories": 
											  ["Museum",
											    "Theatre",
											    "Indoor Recreation ",
											    "Art Center / Gallery"]},
											    {"category": "Health Care",
					    								"css": "Health",
											"subcategories": 
											  ["Hospital or Clinic",
											    "Care and Treatment Facility",
											    "Medical Office"]},
											    {"category": "Education",
					    								"css": "Education",
											"subcategories": 
											  ["K - 12",
											    "Higher Ed",
											    "Community College",
											    "Vocational School"]},
											    {"category": "Government ",
					    								"css": "Government",
											"subcategories": 
											  ["Police ",
											    "Fire",
											    "Library",
											    "City Govt",
											    "Other Govt Dept and Agencies",
											    "Post Office"]},
											    {"category": "Temporary",
					    								"css": "Temporary",
											"subcategories": 
											  ["Placemaking Initiative",
											    "Farmers Market",
											    "Event Location"]},
											    {"category": "Park / Open Space",
					    								"css": "Park",
											"subcategories": 
											  ["Green Space",
											    "Plaza",
											    "Alleyway",
											    "Community Garden / Farm"]},
											    {"category": "Parking",
					    								"css": "Parking",
											"subcategories": 
											  ["Garage"]},
											  { "category": "Public Transit",
					  								"css": "Public",
											"subcategories": [] }];



	return config;
})
