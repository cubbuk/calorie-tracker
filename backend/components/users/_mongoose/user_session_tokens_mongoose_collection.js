(function () {
    const mongooseConnections = require("../../../utility/mongoose_connections.js");
    const mongoose = require("mongoose");
    const userSessionTokenSchemaDefinition = new (require("./schemas/user_session_token_schema"))();
    const userSessionTokenSchema = new mongoose.Schema(userSessionTokenSchemaDefinition.schema, {collection: "user_session_tokens"});
    userSessionTokenSchema.index({expireAt: 1}, {expireAfterSeconds: 0});
    module.exports = mongooseConnections.calorieTrackerDB.model("UserSessionTokens", userSessionTokenSchema);
})();
