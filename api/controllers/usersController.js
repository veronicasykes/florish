// USERS CONTROLLER - HERE BE FOUND USER CRUD AND AUTH

var User = require('../models/User'),
	jwt = require('jsonwebtoken'),
	request = require('request')
	mySpecialSecret = "cactus";
var client = require('twilio')('AC325d73b5b7abd9dbb2ff4366757ecbb5', '31f5ccc5a6ebd60b5cc4c824f56a9986');
// old SID AC9eff848b6d1c0d5bfd1732286da3c5d9
// old AUTH 4908124a91c878a6e2d6341bec25de3f
// bought number 2053907080
// new SID ACd7f826970a3f5cbc0efe4890f5d44a8e
// new AUTH 361871c106d3668f8dcfe705ccc11e20
// 16024287749

function index(req, res){
	// get all the users -- index
	User.find(function(err, users){
		if(err) res.send(err)
		res.json(users)
	})
}

function create(req, res){
	// make a single user -- create
	console.log("Creating a user")
	var user = new User()

	user.name = req.body.name
	user.username = req.body.username
	user.password = req.body.password

	user.save(function(err){
		if(err){
			if(err.code == 11000){
				return res.json({success: false, message: "username already exists" })
			} else {
				res.send(err)
			}
		}
		res.json({success: true, message: "User created, yay!"})
	})
}

function show(req, res){
	//get a single user -- show
	User.findById(req.params.user_id, function(err, user){
		if(err) res.send(err)
		res.json(user)
	})
}

function update(req, res){
	// update a single user -- update
	User.findById(req.params.user_id, function(err, user){
		if(err) res.send(err)

		if(req.body.name) user.name = req.body.name
		if(req.body.username) user.username = req.body.username
		if(req.body.password) user.password = req.body.password

		user.save(function(err){
			if(err) res.send(err)
			res.json({success: true, message: "updated!"})
		})
	})
}

function destroy(req, res){
	// delete a single user -- destroy
	User.remove({
		_id: req.params.user_id
	}, function(err, user){
		if(err) res.send(err)
		res.json({success: true, message: "YOU HAVE BEEN TERMINATED!"})
	})
}


//code for apiRouter.route('/authenticate')
function authenticateUser(req, res) {
	console.log('trying to generate a JWT')
	// 1 - find the user in our db
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user){
		if(err) throw err
		if(!user){
			res.json({success: false, message: "No such user"})
		} else if(user){
			// check passwords
			var validPassword = user.comparePassword(req.body.password)
			if(!validPassword){
				res.json({success: false, message: "Invalid password"})
			} else {
				// password is good!
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, mySpecialSecret, {
					expiresInMinutes: 1440
				})
				// now let's actually give it to them!
				console.log("logged in")
				res.json({ success: true, message: "enjoy your token!", token: token})
			}
		}
	})
}

function checkUser(req, res, next){
	// let's check everywhere for the JWT!
	var token = req.body.token || req.param('token') || req.headers['x-access-token']
	// if we find the token, let's use mySpecialSecret to try and decode it.
	if(token){
		jwt.verify(token, mySpecialSecret, function(err, decoded){
			if(err){
				res.status(403).send({success: false, message: "forbidden, token can't be decoded"})
			} else {
				req.decoded = decoded
				next()
			}
		})
	} else {
		res.status(403).send({success: false, message: "no token."})
	}
	// this is going to run EVERY time our API is hit
	// we want to check if the user is logged in here
	console.log("checking if user is logged in")
}

function testmessage(req,res) {
	console.log('Made it to testmessage')
	// request("http://localhost:8080/error", function(error, response, html) {
 //    if(!error){
 //      //var rqstResponse = response
 //      console.log("response.body", response.body)
 //    }
 //    console.log('get ready for a text')
 //  })

  //Send an SMS text message
  client.sendMessage({

      to:'+14154652990', // Any number Twilio can deliver to
      from: '+18554729851', // A number you bought from Twilio and can use for outbound communication
      body: 'word to your mother. This Came from Twilio fool.' // body of the SMS message

  }, function(err, responseData) { //this function is executed when a response is received from Twilio

      if (!err) { // "err" is an error received during the request, if any

          // "responseData" is a JavaScript object containing data received from Twilio.
          // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
          // http://www.twilio.com/docs/api/rest/sending-sms#example-1

          console.log("twilio error res",responseData.from); // outputs "+14506667788"
          console.log("twilio error res.body",responseData.body); // outputs "word to your mother."

      }
      res.json({message:"success from twilio!"})
  });

}

module.exports = {
	index: index,
	create: create,
	show: show,
	update: update,
	destroy: destroy,
	authenticate: authenticateUser,
	checkUser: checkUser,
	testmessage: testmessage
}
