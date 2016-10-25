const validate = require("validate.js");
const Promise = require("bluebird");
const caloryRecordConstraint = require("../_constraints/calory_record_constraint");

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

    addNewCalorieRecord(record, savedBy) {
        return Promise.try(() => {
            const validationResult = this.validateCalorieRecord(record);
            if (!validationResult) {
                record.createdAt = new Date();
                record.savedBy = savedBy;
                return record;
            } else {
                return {error: validationResult};
            }
        });
    }

    validateCalorieRecord(record, isUpdate) {
        return validate(record, caloryRecordConstraint.caloryRecordConstraints(isUpdate));
    }
}

module.exports = new CalorieRecordsService();