var express = require('express'),
	app = express();
var cartodbClient = require('./cartodbClient');
//body-parser middleware, otherwise req.body is undefined by default
var bodyParser = require('body-parser');
var multer = require('multer');

//Load express routers
var parcelsRoutes = require('./routes/parcelsRoutes');
var parcelRoutes = require('./routes/parcelRoutes'); //for individual parcels


//Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer());
//Routes
app.use('/parcels', parcelsRoutes); //for all parcels
app.use('/parcel', parcelRoutes); //for individual parcels


//Connect to CartoDB via client
cartodbClient.on('connect',function(){
	console.log('Connected to CartoDB...');

	app.listen(8080,function(){
		console.log('App listening on port 8080');
	});
})

cartodbClient.connect();
