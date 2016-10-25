const calorieRecordsService = require("../components/calorie-records/_services/calorie_records_service");
const errorService = require("../utility/_services/error_service");
const calorieRoute = function (path, server) {
    server.get(path, function (req, res, next) {
        calorieRecordsService.retrieveCalorieRecords().then(records => {
            res.send(errorService.resultToStatusCode(records), {records: records, count: records.length});
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.post(path, function (req, res, next) {
        calorieRecordsService.addNewCalorieRecord(req.body, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.put(path + "/:id", function (req, res, next) {
        calorieRecordsService.updateCalorieRecord(req.params.id, req.body, req.user._id).then(result => {
            res.send(errorService.resultToStatusCode(result), result);
            next();
        }).catch(error => {
            res.send(500, error);
            next();
        })
    });

    server.del(path + "/:id", function (req, res, next) {
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