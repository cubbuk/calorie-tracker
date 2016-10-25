/*globals require, module*/
"use strict";
(function () {
    const mongooseConnections = require("../../../utility/mongoose_connections.js");
    const mongoose = require("mongoose");
    const calorieRecordSchemaDefinition = new (require("./schemas/calorie_record_schema"))();
    const calorieRecordSchema = new mongoose.Schema(calorieRecordSchemaDefinition.schema, {collection: "calorie_records"});
    calorieRecordSchema.index({createdBy: 1});
    calorieRecordSchema.index({recordDate: -1});
    module.exports = mongooseConnections.calorieTrackerDB.model("CalorieRecord", calorieRecordSchema);
})();
