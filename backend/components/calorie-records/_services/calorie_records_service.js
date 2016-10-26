const moment = require("moment");
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
            mongoParams.recordOwnerId = searchParams.recordOwnerId;
        }
        if (searchParams.startDate || searchParams.endDate) {
            mongoParams.recordDate = {};
            if (searchParams.startDate) {
                mongoParams.recordDate.$gte = moment(new Date(searchParams.startDate)).startOf("day").toDate();
            }
            if (searchParams.endDate) {
                mongoParams.recordDate.$lte = moment(new Date(searchParams.endDate)).startOf("day").add(1, "day").toDate();
            }
        }
        const startMinutes = (searchParams.startMinutes || 0) % (60 * 24);
        const endMinutes = (searchParams.endMinutes || 0) % (60 * 24);
        if (startMinutes || endMinutes) {
            mongoParams.timeInMinutes = {};
            if (startMinutes) {
                mongoParams.timeInMinutes.$gte = startMinutes;
            }
            if (endMinutes) {
                mongoParams.timeInMinutes.$lte = endMinutes;
            }
        }
        // console.log(searchParams, mongoParams);
        return mongoParams;
    }

    retrieveCalorieRecord(recordId) {
        return calorieRecordMongooseCollection.findOne({_id: recordId}).lean();
    }

    countCalorieRecords(searchParams = {}) {
        return calorieRecordMongooseCollection.count(this.searchParamsToMongoParams(searchParams));
    }

    searchCalorieRecords(params = {}) {
        let {searchParams = {}, orderParams = {recordDate: -1}, pageNumber = 1, resultsPerPage = 10} = params;
        return calorieRecordMongooseCollection.find(this.searchParamsToMongoParams(searchParams)).sort(orderParams).skip((pageNumber - 1) * resultsPerPage).limit(resultsPerPage).lean();
    }

    recordTimeToMinutes(date) {
        const momentDate = moment(date);
        return momentDate.hours() * 60 + momentDate.minutes();
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
                record.timeInMinutes = this.recordTimeToMinutes(record.recordDate);
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
                record.timeInMinutes = this.recordTimeToMinutes(record.recordDate);
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