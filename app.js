var express = require('express'),
	app = express();
var cartodbClient = require('./cartodbClient');
//body-parser middleware, otherwise req.body is undefined by default
var bodyParser = require('body-parser');
var multer = require('multer');

//Load express routers
var parcelRoutes = require('./routes/parcelRoutes'); //for individual parcels
var cityRoutes = require('./routes/cityRoutes');
var assetRoutes = require('./routes/assetRoutes');
var investmentRoutes = require('./routes/investmentRoutes');


//Middleware
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(multer());
//Routes
app.use('/parcel', parcelRoutes); //for parcels
app.use('/city', cityRoutes);
app.use('/asset', assetRoutes);
app.use('/investment',investmentRoutes);


//Connect to CartoDB via client
cartodbClient.on('connect',function(){
	console.log('Connected to CartoDB...');

	app.listen(8080,function(){
		console.log('App listening on port 8080');
	});
})

cartodbClient.connect();
