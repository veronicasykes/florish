var mongoose = require('mongoose')
var Schema = mongoose.Schema
var bcrypt = require('bcrypt-nodejs')

// make a UserSchema
var UserSchema = new Schema({
	name: String,
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true, select: false }
})


// hash the password of a user before he/she is saved
UserSchema.pre('save', function(next){
	var user = this;

	//hash the password only if the user is new, or the password has changed
	if(!user.isModified('password')) return next()

	bcrypt.hash(user.password, null, null, function(err, hash){
		//if error, just move on, with the error
		if(err) return next(err)

		// if no error, set the user.password to the hash, then move on to saving.
		user.password = hash
		next()
	})
})

// give the UserSchema a method to compare incoming passwords 
// with stored/hashed version

UserSchema.methods.comparePassword = function(password){
	var user = this;
	return bcrypt.compareSync(password, user.password)
}

module.exports = mongoose.model('User', UserSchema)


