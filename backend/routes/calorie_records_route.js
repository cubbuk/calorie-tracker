const calorieRecordsService = require("../components/calorie-records/_services/calorie_records_service");
const calorieRoute = function (path, server) {
    server.get(path, function (req, res, next) {
        calorieRecordsService.retrieveCalorieRecords().then(records => {
            setTimeout(() => {
                res.send(200, {records: records, count: records.length});
                next();
            }, 1000);
        }).catch(error => {
            res.send(500, {error});
            next();
        })
    });

    server.post(path, function (req, res, next) {
        calorieRecordsService.addNewCalorieRecord(req.body, req.user._id).then(result => {
            res.send(200, result);
            next();
        }).catch(error => {
            res.send(500, {error});
            next();
        })
    });

    server.put(path + "/:id", function (req, res, next) {
        calorieRecordsService.updateCalorieRecord(req.params.id, req.body, req.user._id).then(result => {
            res.send(200, result);
            next();
        }).catch(error => {
            res.send(500, {error});
            next();
        })
    });

    server.del(path + "/:id", function (req, res, next) {
        calorieRecordsService.deleteCalorieRecord(req.params.id).then(result => {
            res.send(200, result);
            next();
        }).catch(error => {
            res.send(500, {error});
            next();
        })
    });
};


module.exports = calorieRoute;