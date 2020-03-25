// Import mongoose
const mongoose = require("mongoose");
// Repeating message vars
const requiredMsg = "{PATH} is required.";
const minlengthMsg = "{PATH} must be at least {MINLENGTH} characters.";

const TeammateSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, requiredMsg],
		minlength: [2, minlengthMsg]
	},
	email: {
		type: String,
		required: [true, "{PATH} is required."],
		validate: {
			validator: val => /^([\w-\.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
			message: "Please enter a valid email."
		}
	},
	status: String,
	note: String,
});

// Create and export Teammate Model
module.exports = mongoose.model("Teammate", TeammateSchema);