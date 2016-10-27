const asciiToBinaryEncoder = require("atob"); //AsciiToBinaryEncoding
const securityService = require("../../utility/_services/security_service");
const errorService = require("../../utility/_services/error_service");
const userSessionTokenService = require("../../components/users/_services/user_session_token_service");
const usersService = require("../../components/users/_services/users_service");

const authenticationRoute = function (path, server) {

    server.post(path + "/login", (req, res, next) => {
            const authenticationHeader = asciiToBinaryEncoder(securityService.receiveAuthenticationHeader(req) || "");
            const authenticationTokens = authenticationHeader.split(":");
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

    server.post(path + "/signup", (req, res) => {
            let {body = {}} = req;
            usersService.signupUser(body).then(result => {
                res.send(200, result);
            }).catch(error => {
                res.send(500, error);
            });
        }
    );

    server.post(path + "/logout", (req, res, next) => {
        const sessionToken = securityService.receiveAuthenticationHeader(req);
        userSessionTokenService.deleteSessionToken(sessionToken).then(result => {
            res.send(errorService.resultToStatusCode(result), {});
        }, function (err) {
            res.send(500, err);
            next();
        });
    });
};

module.exports = authenticationRoute;