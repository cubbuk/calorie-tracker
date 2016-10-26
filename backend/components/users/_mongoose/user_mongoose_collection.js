(function () {
    const mongooseConnections = require("../../../utility/mongoose_connections.js");
    const mongoose = require("mongoose");
    const userSchemaDefinition = new (require("./schemas/user_schema"))();
    const userSchema = new mongoose.Schema(userSchemaDefinition.schema, {collection: "users"});
    module.exports = mongooseConnections.calorieTrackerDB.model("User", userSchema);
})();
