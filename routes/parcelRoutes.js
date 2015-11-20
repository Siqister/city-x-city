var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');
var secret = require('../secret');
var request = require('request');

//All routes derive from /parcels
router
.all(function(req,res,next){
	next();
})
.get('/',function(req,res){
	console.log('Query entire parcel collection');

	cartodbClient.query(
		"SELECT * FROM {table}",
		{ 
			table:"tdi_parcels"
		},
		function(err,data){
			//Assumes data is in GeoJSON

			if(err){ res.status(400).send(error); }

			console.log('successful GET to /parcel');

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

			console.log('successful GET to /parcel/' + req.params.id);

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
	var query = "UPDATE tdi_parcels SET comment='" 
		+ req.body.comment + 
		"', modified="
		+ req.body.modified + 
		", marked="
		+ req.body.marked +
		", city_owned="
		+ req.body.city_owned +
		", partner_owned="
		+ req.body.partner_owned +
		", vacancy="
		+ req.body.vacancy +
		", tdi_for_sale="
		+ req.body.tdi_for_sale +
		", tdi_for_lease="
		+ req.body.tdi_for_lease +
		", year_built="
		+ req.body.year_built +
		", zoning='"
		+ req.body.zoning + "'" +
		", owner1='"
		+ req.body.owner1 + "'" +
		" WHERE cartodb_id=" + req.params.id;

	console.log(query);

	//TODO: there is a bug here where, if UPDATE or INSERT query is made to the Cartodb API with format=GeoJSON,
	//it returns a syntax error

	/*cartodbClient.query(
		query,
		{table:"tdi_parcels"},
		function(err,data){
			if(err){ 
				console.log(err);
				res.status(400).send(err);
			}
			else{ 
				console.log("successful UPDATE to parcel "+req.params.id);
				res.json(req.body)
			};
		}
	)*/
	
	//TODO: this is a shim; manually make request to cartodb api without specifying GeoJSON format
	request("https://"+secret.USER+".cartodb.com/api/v2/sql?q=" + query + "&api_key=" + secret.API_KEY,
		function(err,response,body){
			if(err || response.statusCode != 200){
				console.error(err);
				res.status(400).send(err);
			}else{
				console.log("successful UPDATE to parcel "+req.params.id);
				res.json(req.body)
			}
		});
	
});

module.exports = router;
