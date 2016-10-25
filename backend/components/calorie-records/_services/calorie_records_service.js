const Promise = require("bluebird");
class CalorieRecordsService {
    retrieveCalorieRecords() {
        return Promise.try(() => {
            return [{_id: 1, description: "Orange", caloryAmount: 120, createdAt: new Date()},
                {
                    _id: 2,
                    description: "Apple",
                    caloryAmount: 90,
                    createdAt: new Date()
                },
                {_id: 3, description: "Bread", caloryAmount: 250, createdAt: new Date()}];
        })
    }
}

module.exports = new CalorieRecordsService();