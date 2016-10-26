const validate = require("validate.js");
const Promise = require("bluebird");
const mongoose = require("mongoose");
const calorieRecordConstraint = require("../_constraints/calorie_record_constraint");
const calorieRecordMongooseCollection = require("../_mongoose/calorie_record_mongoose_collection");
const errorService = require("../../../utility/_services/error_service");

class CalorieRecordsService {

    searchParamsToMongoParams(searchParams = {}) {
        let mongoParams = {};
        if (searchParams.recordOwnerId) {
            mongoParams.recordOwnerId;
        }
        if (searchParams.startDate && searchParams.endDate) {
            mongoParams = {recordDate: {}};
            if (searchParams.startDate) {
                mongoParams.recordDate.$gte = new Date(searchParams.startDate);
            }
            if (searchParams.endDate) {
                mongoParams.recordDate.$lte = new Date(searchParams.endDate);
            }
        }
        console.log(searchParams, mongoParams);
        return mongoParams;
    }

    retrieveCalorieRecord(recordId) {
        return calorieRecordMongooseCollection.findOne({_id: recordId}).lean();
    }

    searchCalorieRecords(params = {}) {
        let {searchParams = {}, orderParams = {}} = params;
        return calorieRecordMongooseCollection.find(this.searchParamsToMongoParams(searchParams)).lean();
    }

    addNewCalorieRecord(record = {}, savedBy) {
        return Promise.try(() => {
            record.recordDate = record.recordDate || new Date();
            const validationResult = this.validateCalorieRecord(record);
            if (!validationResult) {
                record._id = mongoose.Types.ObjectId();
                record.recordOwnerId = record.recordOwnerId || savedBy;
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