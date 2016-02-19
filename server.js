var express 	= require('express'),
	app 		= express(),
	bodyParser 	= require('body-parser'),
	morgan 		= require('morgan'),
	path 		= require('path'),
	port 		= process.env.PORT || 3000,
	mongoose 	= require('mongoose'),
	cors 		= require('cors'),
	apiRouter 	= require('./api/routes/user_routes'),
	aws				= require('aws-sdk'),
	auth = require('./config/auth.js'),
	mongoUri =  process.env.MONGOLAB_URI || 'mongodb://localhost:27017/florish',
	AWS_ACCESS_KEY 	= process.env.AWS_ACCESS_KEY || auth.amazonAuth.clientID,
	AWS_SECRET_KEY 	= process.env.AWS_SECRET_KEY || auth.amazonAuth.clientSecret,
	S3_BUCKET 	 	= process.env.S3_BUCKET || auth.amazonAuth.callBackURL;



mongoose.connect(mongoUri)

// set up middleware
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')))

app.use(morgan('dev'))

app.use('/api', apiRouter) // whenever we get a request starting with /api

app.listen(port)
console.log("listening on port " + port)


app.get('/sign_s3', function(req, res){
	// console.log("get signed request")
    aws.config.update({accessKeyId: AWS_ACCESS_KEY , secretAccessKey: AWS_SECRET_KEY });
    aws.config.update({region: '' , signatureVersion: '' });
    var s3 = new aws.S3();
    console.log('bucket : ' + S3_BUCKET)
    console.log('key : ' + AWS_ACCESS_KEY)
    console.log('secret : ' + AWS_SECRET_KEY)
    var s3_params = {
        Bucket: S3_BUCKET,
        Key: req.query.file_name,
        Expires: 60,
        ContentType: req.query.file_type,
        ACL: 'public-read'
    };
    s3.getSignedUrl('putObject', s3_params, function(err, data){
        if(err){
            console.log(err);
        }
        else{
            var return_data = {
                signed_request: data,
                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name
            };
            res.write(JSON.stringify(return_data));
            res.end();
        }
    });
});
