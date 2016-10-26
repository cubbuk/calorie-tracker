const usersService = require("../components/users/_services/users_service");
const errorService = require("../utility/_services/error_service");
const usersRoute = function (path, server) {
    server.get(path + "/list", function (req, res, next) {
        usersService.retrieveUsers().then(users => {
            res.send(errorService.resultToStatusCode(users), {records: users, count: users.length});
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.post(path + "/create", function (req, res, next) {
        usersService.addNewUser(req.body, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.put(path + "/update/:id", function (req, res, next) {
        usersService.updateUser(req.params.id, req.body, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.post(path + "/calories-per-day", function (req, res, next) {
        let {caloriesPerDay} = req.body;
        usersService.updateCaloriesPerDayOfUser(req.user._id, caloriesPerDay, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.del(path + "/delete/:id", function (req, res, next) {
        usersService.deleteUser(req.params.id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });
};


module.exports = usersRoute;