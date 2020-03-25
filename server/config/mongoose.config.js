// Import mongoose
const mongoose = require("mongoose");

// Export config to be used in server 
module.exports = db_name => {
	mongoose
		.connect(`mongodb://localhost/${db_name}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false
		})
		.then(() => console.log(`Established a connection to ${db_name}`))
		.catch(err => console.log("mongoose connection failed: ", err));
};