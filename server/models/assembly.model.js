// Import mongoose 
const mongoose = require("mongoose");
// Import Teammate model to use as one-to-many in Assembly
const TeammateSchema = require("./teammate.model").schema;

// Repeating message vars
const requiredMsg = "{PATH} is required.";
const minlengthMsg = "{PATH} must be at least {MINLENGTH} characters.";
const maxlengthMsg = "{PATH} must be within {MINLENGTH} characters, like a tweet.";

// Create Assembly Schema
const AssemblySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, requiredMsg],
		minlength: [2, minlengthMsg]
	},
	start: {
		type: Date,
		required: [true, requiredMsg],
	},
	end: {
		type: Date,
		required: [true, requiredMsg],
	},
	description: {
		type: String,
		
	},
	address: {
		street: String,
		city: String,
		state: String,
		zip: Number,
	},
	secretCode: {
		type: String,
		required: [true, requiredMsg],
		minlength: [2, minlengthMsg],
		maxlength: [13, maxlengthMsg],
	},
	eventCode: {
		type: String,
		required: [true, requiredMsg],
		minlength: [2, minlengthMsg],
		maxlength: [20, maxlengthMsg],
	},
	team: [TeammateSchema],
}, { timestamps: true }
)

// Create and export Assembly Model to be used in Controller.
// "Assembly" collection is created when we insert to it
module.exports = mongoose.model("Assembly", AssemblySchema);