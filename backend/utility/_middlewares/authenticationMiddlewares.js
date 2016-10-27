const pathService = require("../_services/path_service");
const securityService = require("../_services/security_service");
const userSessionTokenService = require("../../components/users/_services/user_session_token_service");

class AuthenticationMiddleware {

    constructor() {
        pathService.addPathToWhiteList("api/login");
        pathService.addPathToWhiteList("api/signup");
    }

    authenticateRequests(req, res, next) {
        const sessionToken = securityService.receiveAuthenticationHeader(req);
        if (pathService.isInWhiteList(req.path())) {
            next();
        } else if (sessionToken) {
            userSessionTokenService.validateSessionToken(sessionToken).then(result => {
                req.user = result.user;
                req.userId = result.user ? result.user._id : undefined;
                req.token = sessionToken;
                next();
            }).catch(err => {
                res.send(401, err);
            })
        } else {
            res.send(401);
        }
    }

}

module.exports = new AuthenticationMiddleware();