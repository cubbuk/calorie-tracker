const validate = require("validate.js");
const Promise = require("bluebird");
const mongoose = require("mongoose");
const calorieRecordConstraint = require("../_constraints/calorie_record_constraint");
const calorieRecordMongooseCollection = require("../_mongoose/calorie_record_mongoose_collection");
const errorService = require("../../../utility/_services/error_service");

class CalorieRecordsService {

    retrieveCalorieRecord(recordId) {
        return calorieRecordMongooseCollection.findOne({_id: recordId});
    }

    retrieveCalorieRecords() {
        return calorieRecordMongooseCollection.find();
    }

    addNewCalorieRecord(record = {}, savedBy) {
        return Promise.try(() => {
            record.recordDate = new Date();
            const validationResult = this.validateCalorieRecord(record);
            if (!validationResult) {
                record._id = mongoose.Types.ObjectId();
                record.createdAt = new Date();
                record.createdBy = savedBy;
                return calorieRecordMongooseCollection.create(record);
            } else {
                return errorService.createValidationError(validationResult);
            }
        });
    }

    updateCalorieRecord(recordId, record, savedBy) {
        return Promise.try(() => {
            const validationResult = this.validateCalorieRecord(record);
            if (!validationResult) {
                delete record._id;
                record.updatedAt = new Date();
                record.updatedBy = savedBy;
                return calorieRecordMongooseCollection.update({_id: recordId}, record).then(() => this.retrieveCalorieRecord(recordId))
            } else {
                return errorService.createValidationError(validationResult);
            }
        });
    }

    deleteCalorieRecord(recordId) {
        return calorieRecordMongooseCollection.remove({_id: recordId});
    }

    validateCalorieRecord(record) {
        return validate(record, calorieRecordConstraint.calorieRecordConstraints(), {fullMessages: false});
    }
}

module.exports = new CalorieRecordsService();