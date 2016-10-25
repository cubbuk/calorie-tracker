const calorieRecordsService = require("../components/calorie-records/_services/calorie_records_service");
const calorieRoute = function (path, server) {
    server.get(path, function (req, res, next) {
        calorieRecordsService.retrieveCalorieRecords().then(records => {
            res.send(200, {records: records, count: records.length});
            next();
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
};


module.exports = calorieRoute;