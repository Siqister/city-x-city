var express = require('express'),
	router = express.Router();
var cartodbClient = require('../cartodbClient');

//All routes derive from /parcels
router
.all(function(req,res,next){
	next();
})
.get('/',function(req,res){

	cartodbClient.query(
		"SELECT * FROM {table}",
		{ 
			table:"pittsfield"
		},
		function(err,data){
			res.json(data);
		}
	);

});

module.exports = router;
