var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');

//All routes derive from /parcels
router
.all(function(req,res,next){
	next();
})
.get('/:id',function(req,res){

	cartodbClient.query(
		"SELECT * FROM {table} WHERE cartodb_id=" + req.params.id,
		{ table:"pittsfield" },
		function(err,data){
			if(err){ res.send(err); }
			else{
				res.json(data.features[0].properties);
			}
		}
	);

})
.put('/:id',function(req,res){
	//HTTP PUT request assumes req.body contains the entire resource representation
	console.log("UPDATE to parcel "+req.params.id);
	
	//Construct query string
	var query = "UPDATE {table} SET comment='" + req.body.comment + "', modified=" + req.body.modified + " WHERE cartodb_id=" + req.params.id;

	cartodbClient.query(
		query,
		{table:"pittsfield"},
		function(err,data){
			if(err){ 
				console.log("Update error");
				res.send(err);
			}
			else{ res.json(req.body)};
		}
	)
});

module.exports = router;
