const uuid = require("uuid");
const _ = require("lodash");
const validate = require("validate.js");
const Promise = require("bluebird");
const calorieRecordConstraint = require("../_constraints/calorie_record_constraint");

let mockRecords = [{_id: uuid.v4(), description: "Orange", calorieAmount: 120, createdAt: new Date()},
    {
        _id: uuid.v4(),
        description: "Apple",
        calorieAmount: 90,
        createdAt: new Date()
    },
    {_id: uuid.v4(), description: "Bread", calorieAmount: 250, createdAt: new Date()}];
class CalorieRecordsService {

    retrieveCalorieRecords() {
        return Promise.try(() => {
            return mockRecords;
        })
    }

    addNewCalorieRecord(record = {}, savedBy) {
        return Promise.try(() => {
            const validationResult = this.validateCalorieRecord(record);
            if (!validationResult) {
                record._id = uuid.v4();
                record.createdAt = new Date();
                record.createdBy = savedBy;
                mockRecords.push(record);
                return record;
            } else {
                return {error: validationResult};
            }
        });
    }

    updateCalorieRecord(recordId, record, savedBy) {
        return Promise.try(() => {
            const validationResult = this.validateCalorieRecord(record, true);
            if (!validationResult) {
                record.updatedAt = new Date();
                record.updatedBy = savedBy;
                let recordIndex = _.findIndex(mockRecords, mockRecord => mockRecord._id === recordId);
                if (recordIndex > -1) {
                    mockRecords[recordIndex] = record;
                }
                return record;
            } else {
                return {error: validationResult};
            }
        });
    }

    deleteCalorieRecord(recordId) {
        return Promise.try(() => {
            let record = mockRecords.filter(mockRecord => mockRecord._id === recordId)[0];
            mockRecords = mockRecords.filter(mockRecord => mockRecord._id !== recordId);
            return record;
        });
    }

    validateCalorieRecord(record, isUpdate) {
        return validate(record, calorieRecordConstraint.calorieRecordConstraints(isUpdate));
    }
}

module.exports = new CalorieRecordsService();