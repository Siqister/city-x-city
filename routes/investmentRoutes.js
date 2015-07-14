var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');

router
.all(function(req,res,next){
	console.log(req.method)
})
.get('/',function(req,res,next){
	var query = "SELECT * FROM {table}";

	cartodbClient.query(query,
		{table:'tdi_investments'},function(err,data){
			if(err){
				res.send(err);
			}else{
				console.log('SUCCESSFUL GET /investment');
				//flatten response
				data.features.forEach(function(feature){
					for(var key in feature.properties){
						feature[key] = feature.properties[key];
						delete feature.properties[key];
					}

					feature.type = 'investment';
				});

				res.json(data.features);
			}
		});
})
.post('/',function(req,res,next){
	var loc = req.body.geometry.coordinates;

	var query = "INSERT INTO {table} (city,the_geom,name,comment,type,value) "
		+"VALUES ('"
		+ req.body.city + "',"
		+ "ST_GeomFromText('POINT("+loc[0]+" "+loc[1]+")',4326)" + ",'"
		+ req.body.name + "','"
		+ req.body.comment + "','"
		+ req.body.type + "',"
		+ req.body.value +
		") RETURNING cartodb_id";

	cartodbClient.query(query,
		{table:'tdi_investments'},function(err,data){
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
.put('/:id',function(req,res,next){
	console.log('PUT REQUEST TO /investment');
	console.log(req.body);

	var query = "UPDATE {table} SET comment='" 
		+ req.body.comment + 
		"' WHERE cartodb_id=" + req.params.id;

	cartodbClient.query(query,{table:'tdi_investments'},function(err,data){
		if(err){
			res.send(err);
		}else{
			console.log('SUCCESSFUL UPDATE TO ASSET '+req.params.id);
			res.json(req.body);
		}
	});

})
.delete('/:id',function(req,res,next){
	
})

module.exports = router;