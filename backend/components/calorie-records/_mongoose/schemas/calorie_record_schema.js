/*globals require, module*/
"use strict";
(function () {
    const mongoose = require("mongoose");

    class CalorieRecordSchema {
    }

    CalorieRecordSchema.prototype.schema = {
        _id: {type: mongoose.Schema.Types.ObjectId},
        description: {type: String, trim: true},
        calorieAmount: Number,
        recordDate: Date,
        createdAt: Date,
        createdBy: {type: mongoose.Schema.Types.ObjectId, trim: true},
        updatedAt: Date,
        updatedBy: {type: mongoose.Schema.Types.ObjectId, trim: true}
    };

    module.exports = CalorieRecordSchema;
})();
