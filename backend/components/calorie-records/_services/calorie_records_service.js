const moment = require("moment");
const validate = require("validate.js");
const Promise = require("bluebird");
const mongoose = require("mongoose");
const calorieRecordConstraint = require("../_constraints/calorie_record_constraint");
const calorieRecordMongooseCollection = require("../_mongoose/calorie_record_mongoose_collection");
const errorService = require("../../../utility/_services/error_service");

class CalorieRecordsService {

    searchParamsToMongoQuery(searchParams = {}) {
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
        return calorieRecordMongooseCollection.count(this.searchParamsToMongoQuery(searchParams));
    }

    searchCalorieRecords(params = {}) {
        let {searchParams = {}, orderParams = {recordDate: -1}, pageNumber = 1, resultsPerPage = 10} = params;
        return calorieRecordMongooseCollection.find(this.searchParamsToMongoQuery(searchParams)).sort(orderParams).skip((pageNumber - 1) * resultsPerPage).limit(resultsPerPage).lean();
    }

    dailyCalorieRecordSummaries(searchParams = {}) {
        let aggregationOperations = [];
        aggregationOperations.push({$match: this.searchParamsToMongoQuery(searchParams)});
        aggregationOperations.push({
            $project: {
                calorieAmount: "$calorieAmount",
                yearMonthDay: {$dateToString: {format: "%Y-%m-%d", date: "$recordDate"}}
            }
        });
        aggregationOperations.push({$group: {_id: "$yearMonthDay", totalAmount: {$sum: "$calorieAmount"}}});
        aggregationOperations.push({$sort: {_id: -1}});
        return calorieRecordMongooseCollection.aggregate(aggregationOperations).then(results => {
            return results.map(result => {
                result.date = moment(result._id, "YYYYMMDD").toDate();
                delete result._id;
                return result;
            });
        });
    }

    recordTimeToMinutes(date) {
        const momentDate = moment(date);
        return momentDate.hours() * 60 + momentDate.minutes();
    }

    addNewCalorieRecord(record = {}, savedBy) {
        return Promise.try(() => {
            record.recordDate = record.recordDate || new Date();
            record.recordOwnerId = record.recordOwnerId || savedBy;
            const validationResult = this.validateCalorieRecord(record);
            if (!validationResult) {
                record._id = mongoose.Types.ObjectId();
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
                if(!record.recordOwnerId){
                    delete record.recordOwnerId;
                }
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