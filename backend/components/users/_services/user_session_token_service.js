const userSessionTokenMongooseCollection = require("../_mongoose/user_session_tokens_mongoose_collection");
const sessionTokenService = require("../../../utility/_services/session_token_service");
class UserSessionTokenService extends sessionTokenService {
    constructor() {
        super(userSessionTokenMongooseCollection, {DURATION: 1, UNIT: "days"});
    }
}

module.exports = new UserSessionTokenService();