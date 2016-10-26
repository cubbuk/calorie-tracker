/*globals require, module*/
"use strict";

const asciiToBinaryEncoder = require("atob"); //AsciiToBinaryEncoding
const pathService = require("../utility/_services/path_service");
const securityService = require("../utility/_services/security_service");
const errorService = require("../utility/_services/error_service");
const userSessionTokenService = require("../components/users/_services/user_session_token_service");
const usersService = require("../components/users/_services/users_service");

(function () {

    const LOGIN_URL = "api/login";
    pathService.addPathToWhiteList(LOGIN_URL);

    module.exports = (server) => {

        server.use((req, res, next) => {
                var sessionToken = securityService.receiveAuthenticationHeader(req);
                console.log(sessionToken);
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
        );

        server.post(LOGIN_URL, function (req, res, next) {
                var authenticationHeader = asciiToBinaryEncoder(securityService.receiveAuthenticationHeader(req) || "");
                var authenticationTokens = authenticationHeader.split(":");
                if (authenticationTokens.length === 2) {
                    usersService.authenticateUser(authenticationTokens[0], authenticationTokens[1]).then(result => {
                        res.send(200, result);
                    }).catch(function (err) {
                        res.send(401, errorService.createCustomError(err, "Giriş sırasında hata alındı"));
                        next();
                    });
                } else {
                    res.send(401);
                    next();
                }
            }
        );

    }
})();
