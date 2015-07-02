var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');

//All routes derive from /parcels
router
.all(function(req,res,next){
	next();
})
.get('/',function(req,res){
	console.log('Query collection');

	cartodbClient.query(
		"SELECT * FROM {table}",
		{ 
			table:"tdi_parcels"
		},
		function(err,data){
			if(err){ res.send(err); }

			data.features.forEach(function(feature){
				for(var key in feature.properties){
					feature[key] = feature.properties[key];
				}

				delete feature.properties;
			});
			res.json(data.features);
		}
	);

})
.get('/:id',function(req,res){

	cartodbClient.query(
		"SELECT * FROM {table} WHERE cartodb_id=" + req.params.id,
		{ table:"tdi_parcels" },
		function(err,data){
			if(err){ res.send(err); }
			else{

			//data returns a feature collection
				var feature = data.features[0];
				for(var key in feature.properties){
					feature[key] = feature.properties[key];
				}
				delete feature.properties;
				
				res.json(feature);
			}
		}
	);

})
.put('/:id',function(req,res){
	//HTTP PUT request assumes req.body contains the entire resource representation
	
	//Construct query string
	var query = "UPDATE {table} SET comment='" 
		+ req.body.comment + 
		"', modified="
		+ req.body.modified + 
		", marked="
		+ req.body.marked +
		", city_owned="
		+ req.body.cityOwned +
		", partner_owned="
		+ req.body.partnerOwned +
		" WHERE cartodb_id=" + req.params.id;

	cartodbClient.query(
		query,
		{table:"tdi_parcels"},
		function(err,data){
			if(err){ 
				console.log(err);
				res.send(err);
			}
			else{ 
				console.log("UPDATE to parcel "+req.params.id);
				res.json(req.body)
			};
		}
	)
});

module.exports = router;
