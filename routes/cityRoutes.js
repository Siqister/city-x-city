var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');

router
.all(function(req,res,next){
	next();
})
.get('/',function(req,res,next){
	cartodbClient.query(
		'SELECT city, COUNT(cartodb_id) AS numOfParcels, COUNT(marked=true) as marked, ST_EXTENT(the_geom) as extent, ST_CENTROID(ST_COLLECT(the_geom)) as the_geom FROM {table} GROUP BY city',
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
});

module.exports = router;