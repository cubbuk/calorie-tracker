const calorieRecordsService = require("../../components/calorie-records/_services/calorie_records_service");
const errorService = require("../../utility/_services/error_service");
const usersService = require("../../components/users/_services/users_service");
const userRoleService = require("../../components/users/_services/user_role_service");
const calorieRecordsRouteMiddleware = require("./calorie_records_route_middleware");
const userRouteMiddleware = require("../users_route/user_route_middlewares");

const calorieRoute = function (path, server) {

    const hasAdminRole = userRouteMiddleware.adminRoute.bind(userRouteMiddleware);
    const isAdminOrOwnRecord = calorieRecordsRouteMiddleware.isAdminOrOwnRecord.bind(calorieRecordsRouteMiddleware);
    const isAdminOrCreatingForOwn = calorieRecordsRouteMiddleware.isAdminOrCreatingForOwn.bind(calorieRecordsRouteMiddleware);

    server.get(path + "/list", hasAdminRole, function (req, res, next) {
        let {body = {}} = req;
        let {searchParams = {}, orderParams = {}} = body;
        calorieRecordsService.retrieveCalorieRecords(searchParams, orderParams).then(records => {
            return usersService.fullfillUsersOfCalorieRecords(records);
        }).then(records => {
            res.send(errorService.resultToStatusCode(records), {records: records, count: records.length});
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        });
    });

    server.get(path + "/list-of-user", function (req, res, next) {
        let {body = {}, user = {}} = req;
        let {searchParams = {}, orderParams = {}} = body;
        searchParams.createdBy = user._id;
        calorieRecordsService.retrieveCalorieRecords(searchParams, orderParams).then(records => {
            res.send(errorService.resultToStatusCode(records), {records: records, count: records.length});
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