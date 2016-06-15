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
	mongoUri =  process.env.MONGOLAB_URI || 'mongodb://localhost:27017/florish',
	AWS_ACCESS_KEY 	= process.env.AWS_ACCESS_KEY,
	AWS_SECRET_KEY 	= process.env.AWS_SECRET_KEY,
	S3_BUCKET 	 	= process.env.S3_BUCKET
//require the Twilio module and create a REST client
var client = require('twilio')('AC325d73b5b7abd9dbb2ff4366757ecbb5', '31f5ccc5a6ebd60b5cc4c824f56a9986');
// old SID AC9eff848b6d1c0d5bfd1732286da3c5d9
// old AUTH 4908124a91c878a6e2d6341bec25de3f
// bought number 2053907080
// new SID ACd7f826970a3f5cbc0efe4890f5d44a8e
// new AUTH 361871c106d3668f8dcfe705ccc11e20
// 16024287749
// Ver new # SID PN061c41c74a3597fdad5c7c6362bbb4f4
// Ver test SID AC00d55fb366ebaf6dbcd7627dd611998c
// Ver test Auth 
var cron = require('cron');
var cronJob = cron.job("0 * * * * *", function(){
    // perform operation e.g. GET request http.get() etc.
    // 14154652990
    //Send an SMS text message
    // client.sendMessage({

    //     to:'+14803527275', // Any number Twilio can deliver to
    //     from: '+18554729851', // A number you bought from Twilio and can use for outbound communication
    //     body: 'word to your mother.' // body of the SMS message

    // }, function(err, responseData) { //this function is executed when a response is received from Twilio

    //     if (!err) { // "err" is an error received during the request, if any

    //         // "responseData" is a JavaScript object containing data received from Twilio.
    //         // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
    //         // http://www.twilio.com/docs/api/rest/sending-sms#example-1

    //         console.log(responseData.from); // outputs "+14506667788"
    //         console.log(responseData.body); // outputs "word to your mother."

    //     }
    // });

    console.log('cron job completed');
}); 
cronJob.start();

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
