define([],function(){
	var config = {};

	config.mapLayers = [
		{
			name:'Ownership', 
			options:[
				{name:"Publicly Owned",color:'#d6d4ea'},
				{name:"Partner-Controlled",color:'#96d5cf'}
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

	return config;
})
