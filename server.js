var express 	= require('express'),
	app 		= express(),
	bodyParser 	= require('body-parser'),
	morgan 		= require('morgan'),
	path 		= require('path'),
	port 		= process.env.PORT || 3000,
	mongoose 	= require('mongoose'),
	cors 		= require('cors'),
	apiRouter 	= require('./api/routes/userRoutes')

mongoose.connect('mongodb://localhost:27017/florish')

// set up middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use(morgan('dev'))

app.use('/api', apiRouter) // whenever we get a request starting with /api

app.listen(port)
console.log("listening on port " + port)
