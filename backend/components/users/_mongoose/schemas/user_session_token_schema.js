(function () {
    class UserSessionTokenSchema {
    }

    UserSessionTokenSchema.prototype.schema = {
        _id: {type: String, trim: true},
        expireAt: {type: Date},
        user: {}
    };

    module.exports = UserSessionTokenSchema;
})();
