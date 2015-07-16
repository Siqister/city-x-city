var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');

router
.all(function(req,res,next){
	next();
})
.get('/',function(req,res,next){
	cartodbClient.query(
		'SELECT city, COUNT(cartodb_id) AS numOfParcels, COUNT(CASE WHEN marked THEN 1 ELSE null END) as marked, COUNT(CASE WHEN city_owned THEN 1 ELSE null END) as city_owned,COUNT(CASE WHEN partner_owned THEN 1 ELSE null END) as partner_owned,ST_EXTENT(the_geom) as extent, ST_CENTROID(ST_COLLECT(the_geom)) as the_geom FROM {table} GROUP BY city',
		{ table:'tdi_parcels'},
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
	)
})
.get('/:id',function(req,res,next){
	console.log(req);
	var city = (req.params.id).toUpperCase();
	console.log(city);

	var query = "SELECT cartodb_id, the_geom, bld_area, bldg_val, land_val, lot_size, total_val, use_code, year_built, zoning from {table} WHERE city='"+city+"'";
	console.log(query)

	cartodbClient.query(
		query,
		{table:'tdi_parcels'},
		function(err,data){
			if(err){ res.send(err); }

			var parcels = [];
			data.features.forEach(function(feature){
				for(var key in feature.properties){
					feature[key] = feature.properties[key];
				}

				delete feature.properties;
				parcels.push(feature)
			});

			res.json({
				city:city,
				parcels:parcels
			});
		}
	)
})

module.exports = router;