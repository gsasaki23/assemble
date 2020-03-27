// Import mongoose 
const mongoose = require("mongoose");
// Import Teammate model to use as one-to-many in Assembly
const TeammateSchema = require("./teammate.model").schema;

// Repeating message vars
const requiredMsg = "{PATH} is required.";
const minlengthMsg = "{PATH} must be at least {MINLENGTH} characters.";
const maxlengthMsg = "{PATH} must be within {MAXLENGTH} characters.";
const uniqueMsg = "{PATH} must be unique.";

// Create Assembly Schema
const AssemblySchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, requiredMsg],
		minlength: [2, minlengthMsg],
	},
	date: {
		type: String,
		required: [true, requiredMsg],
	},
	start: {
		type: String,
		required: [true, requiredMsg],
	},
	end: {
		type: String,
		required: [true, requiredMsg],
	},
	description: {
		type: String,
	},
	address: {
		name: {
			type: String,
			required: [true, requiredMsg]
		},
		street: {
			type: String,
			required: [true, requiredMsg]
		},
		city: {
			type: String,
			required: [true, requiredMsg]
		},
		state: {
			type: String,
			required: [true, requiredMsg],
			minlength: [2, minlengthMsg],
			maxlength: [2, maxlengthMsg],
		},
		zip: {
			type: Number,
			required: [true, requiredMsg],
			minlength: [5, minlengthMsg],
			maxlength: [5, maxlengthMsg],
		},
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