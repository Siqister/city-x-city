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
		"SELECT the_geom,owner1 FROM {table} WHERE cartodb_id=" + req.params.id,
		{ table:"pittsfield" },
		function(err,data){
			res.json(data);
		}
	);

});

module.exports = router;
