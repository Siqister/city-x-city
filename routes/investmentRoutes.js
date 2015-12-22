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

	console.log(req.body);

	var query = "INSERT INTO {table} (city,the_geom,name,comment,type,value,address,contact) "
		+"VALUES ('"
		+ req.body.city + "',"
		+ "ST_GeomFromText('POINT("+loc[0]+" "+loc[1]+")',4326)" + ",'"
		+ req.body.name + "','"
		+ req.body.comment + "','"
		+ req.body.investmentType + "',"
		+ req.body.value + ",'"
		+ req.body.address + "','"
		+ req.body.contact + "'" +
		") RETURNING cartodb_id";


	cartodbClient.query(query,
		{table:'tdi_investments'},function(err,data){
			if(err){ 
				res.status(400).send(err);
				console.log(err);
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
	console.log('DELETE REQUEST TO /investment');

	var query = "DELETE FROM {table} WHERE cartodb_id=" + req.params.id;

	cartodbClient.query(query,{table:'tdi_investments'},function(err,data){
		if(err){
			res.send(err);
		}else{
			console.log('SUCCESSFUL DELETE TO INVESTMENT ' + req.params.id);
			res.json(req.body);
		}
	})
})

module.exports = router;