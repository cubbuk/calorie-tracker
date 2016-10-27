const Promise = require("bluebird");
const usersService = require("../../components/users/_services/users_service");
const userRouteMiddleware = require("./user_route_middlewares");
const errorService = require("../../utility/_services/error_service");

const usersRoute = function (path, server) {

    const hasManagerRole = userRouteMiddleware.managerRoute.bind(userRouteMiddleware);

    server.get(path + "/byId/:id", hasManagerRole, function (req, res, next) {
        usersService.retrieveUser(req.params.id).then(user => {
            res.send(errorService.resultToStatusCode(user), user);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.post(path + "/search", hasManagerRole, function (req, res, next) {
        let {body = {}} = req;
        let {searchParams = {}} = body;
        const searchPromise = usersService.searchUsers(body);
        const countPromise = usersService.countUsers(searchParams);
        Promise.all([searchPromise, countPromise]).then(results => {
            res.send(errorService.resultToStatusCode(results[0]), {records: results[0], count: results[1]});
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.post(path + "/list", hasManagerRole, function (req, res, next) {
        let {body = {}} = req;
        usersService.searchUsers(body).then(users => {
            res.send(errorService.resultToStatusCode(users), users);
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