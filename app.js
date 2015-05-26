var express = require('express'),
	app = express();
var cartodbClient = require('./cartodbClient');

//Load express routers
var parcelsRoutes = require('./routes/parcelsRoutes');
var parcelRoutes = require('./routes/parcelRoutes'); //for individual parcels


//Define app routes
app.use(express.static('public'));
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
