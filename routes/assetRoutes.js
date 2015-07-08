var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');

router
.all(function(req,res,next){
	console.log(req.method)
})
.get('/',function(req,res,next){})
.post('/',function(req,res,next){
	var loc = req.body.geometry.coordinates;

	var query = "INSERT INTO {table} (city,the_geom,name,comments) "
		+"VALUES ('"
		+ req.body.city + "',"
		+ "ST_GeomFromText('POINT("+loc[0]+" "+loc[1]+")',4326)" + ",'"
		+ req.body.name + "','"
		+ req.body.comment +
		"') RETURNING cartodb_id";

	cartodbClient.query(query,
		{table:'tdi_assets'},function(err,data){
			if(err){ 
				res.send(err);
			}
			else{
				console.log('SUCCESSFULLY POST');
				var newID = data.rows[0].cartodb_id; //acquires new cartodb_id, send it back
				var response = req.body;
				response.cartodb_id = newID;

				res.json(response);
			}
		});
})
.put('/:id',function(req,res,next){})
.delete('/:id',function(req,res,next){})

module.exports = router;