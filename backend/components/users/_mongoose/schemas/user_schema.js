(function () {
    const mongoose = require("mongoose");

    class UserSchema {
    }

    UserSchema.prototype.schema = {
        _id: {type: mongoose.Schema.Types.ObjectId},
        username: {type: String, trim: true, index: {unique: true}},
        password: {type: String, trim: true},
        fullName: {type: String, trim: true},
        roles: [Number],
        caloriesPerDay: Number,
        createdAt: Date,
        createdBy: {type: mongoose.Schema.Types.ObjectId, trim: true},
        updatedAt: Date,
        updatedBy: {type: mongoose.Schema.Types.ObjectId, trim: true}
    };

    module.exports = UserSchema;
})();
