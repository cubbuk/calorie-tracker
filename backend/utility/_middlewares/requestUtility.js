const restify = require("restify");
class RequestUtility {
    unknownMethodHandler(req, res) {
        if (req.method.toLowerCase() === "options") {
            const allowHeaders = ["Accept", "Accept-Version", "Content-Type", "Api-Version", "Origin", "X-Requested-With", "Authorization"]; // added Origin & X-Requested-With & **Authorization**

            if (res.methods.indexOf("OPTIONS") === -1) {
                res.methods.push("OPTIONS")
            }
            res.header("Access-Control-Allow-Credentials", true);
            res.header("Access-Control-Allow-Headers", allowHeaders.join(", "));
            res.header("Access-Control-Allow-Methods", res.methods.join(", "));
            res.header("Access-Control-Allow-Origin", req.headers.origin);

            return res.send(200);
        }
        else {
            return res.send(new restify.MethodNotAllowedError());
        }
    };

    uncaughtException(req, res, route, error) { // Catches all uncaught errors generated during restify middleware steps
        console.error(error);
        console.log(error.stack);
        process.exit(1);
    };
}

module.exports = new RequestUtility();