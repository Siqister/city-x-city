define([],function(){
	var config = {};

	config.mapLayers = [
		{
			name:'Ownership', 
			options:[
				{name:"Publicly Owned"},
				{name:"Partner-Controlled"}
			]
		},
		{
			name:'Vacancy',
			cartodbCol: 'tdi_vacancy',
			options:[
				{name:"Ground floor",cartodbVal:0,color:'red'},
				{name:"Upper floor",cartodbVal:1,color:'blue'},
				{name:"Total vacancy",cartodbVal:2,color:'purple'}
			],
			defaults:{
				color:'yellow'
			}
		},
		{
			name:'Land Use',
			cartodbCol: 'tdi_land_use',
			options:[
				{name:"Residential",cartodbVal:0,color:'yellow'},
				{name:"Commercial",cartodbVal:1,color:'red'},
				{name:"Industrial",cartodbVal:2,color:'purple'},
				{name:"Institutional",cartodbVal:3,color:'rgb(180,180,180)'}
			],
			defaults:{
				color:'white'
			}
		}
	];

	return config;
})