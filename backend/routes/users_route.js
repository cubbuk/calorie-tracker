const usersService = require("../components/users/_services/users_service");
const userRouteMiddleware = require("../components/users/_middlewares/user_route_middlewares");
const errorService = require("../utility/_services/error_service");

const usersRoute = function (path, server) {

    const hasManagerRole = userRouteMiddleware.managerRoute.bind(userRouteMiddleware);

    server.get(path + "/list", hasManagerRole, function (req, res, next) {
        usersService.retrieveUsers().then(users => {
            res.send(errorService.resultToStatusCode(users), {records: users, count: users.length});
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.post(path + "/create", hasManagerRole, function (req, res, next) {
        usersService.addNewUser(req.body, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.put(path + "/update/:id", hasManagerRole, function (req, res, next) {
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

    server.del(path + "/delete/:id", hasManagerRole, function (req, res, next) {
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