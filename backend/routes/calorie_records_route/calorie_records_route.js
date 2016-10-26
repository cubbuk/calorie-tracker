const Promise = require("bluebird");
const calorieRecordsService = require("../../components/calorie-records/_services/calorie_records_service");
const errorService = require("../../utility/_services/error_service");
const usersService = require("../../components/users/_services/users_service");
const calorieRecordsRouteMiddleware = require("./calorie_records_route_middleware");
const userRouteMiddleware = require("../users_route/user_route_middlewares");

const calorieRoute = function (path, server) {

    const hasAdminRole = userRouteMiddleware.adminRoute.bind(userRouteMiddleware);
    const isAdminOrOwnRecord = calorieRecordsRouteMiddleware.isAdminOrOwnRecord.bind(calorieRecordsRouteMiddleware);
    const isAdminOrCreatingForOwn = calorieRecordsRouteMiddleware.isAdminOrCreatingForOwn.bind(calorieRecordsRouteMiddleware);

    server.post(path + "/list", hasAdminRole, function (req, res, next) {
        let {body = {}} = req;
        let {searchParams = {}} = body;
        const searchPromise = calorieRecordsService.searchCalorieRecords(body);
        const countPromise = calorieRecordsService.countCalorieRecords(searchParams);
        Promise.all([searchPromise, countPromise]).then(results => {
            return usersService.fullfillUsersOfCalorieRecords(results[0]).then(records => {
                results[0] = records;
                return results;
            })
        }).then(results => {
            res.send(200, {records: results[0], count: results[1]});
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        });
    });

    server.post(path + "/list-of-user", function (req, res, next) {
        let {body = {}, user = {}} = req;
        body.searchParams = body.searchParams || {};
        body.searchParams.recordOwnerId = user._id;
        const searchPromise = calorieRecordsService.searchCalorieRecords(body);
        const countPromise = calorieRecordsService.countCalorieRecords(body.searchParams);
        Promise.all([searchPromise, countPromise]).then(results => {
            res.send(200, {records: results[0], count: results[1]});
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        });
    });

    server.post(path + "/create", isAdminOrCreatingForOwn, function (req, res, next) {
        calorieRecordsService.addNewCalorieRecord(req.body, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        });
    });

    server.put(path + "/update/:id", isAdminOrOwnRecord, function (req, res, next) {
        calorieRecordsService.updateCalorieRecord(req.params.id, req.body, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.del(path + "/delete/:id", isAdminOrOwnRecord, function (req, res, next) {
        calorieRecordsService.deleteCalorieRecord(req.params.id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });
};


module.exports = calorieRoute;