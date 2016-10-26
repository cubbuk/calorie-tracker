const Promise = require("bluebird");
const userRoleService = require("../../components/users/_services/user_role_service");
const calorieRecordsService = require("../../components/calorie-records/_services/calorie_records_service");

class CalorieRecordsRouteMiddleware {
    isAdminOrOwnRecord(req, res, next) {
        return Promise.try(() => {
            if (userRoleService.hasAdminRole(req.user)) {
                next();
            } else {
                return calorieRecordsService.retrieveCalorieRecord(req.params.id).then((record = {}) => {
                    if (record.recordOwnerId.toString() === req.user._id.toString()) {
                        next();
                    } else {
                        res.send(403);
                    }
                });
            }
        });
    }

    isAdminOrCreatingForOwn(req, res, next) {
        if (userRoleService.hasAdminRole(req.user)) {
            next();
        } else {
            let record = {} = req.body;
            if (!record.createdBy) {
                next();
            } else {
                res.send(403);
            }
        }
    }
}

module.exports = new CalorieRecordsRouteMiddleware();