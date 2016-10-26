const _ = require("lodash");
const Promise = require("bluebird");
const moment = require("moment");
const mongoose = require("mongoose");

class SessionTokenService {
    constructor(sessionTokenMongooseCollection, DEFAULT_TTL = {DURATION: 7, UNIT: "days"}) {
        this.sessionTokenMongooseCollection = sessionTokenMongooseCollection;
        this.DEFAULT_TTL = DEFAULT_TTL
    }

    resetTTLForSessionToken(token, user, numberOfDays = this.DEFAULT_TTL.DURATION) {
        return Promise.try(() => {
            const expireAt = moment().add(numberOfDays, this.DEFAULT_TTL.UNIT).toDate();
            const updateObject = {expireAt};
            if (user) {
                updateObject.user = user;
            }
            return this.sessionTokenMongooseCollection.update({_id: token}, {$set: updateObject}, {upsert: true});
        });
    }

    validateSessionToken(sessionToken) {
        return this.findSessionTokenById(sessionToken).then(userSessionTokenObject => {
            if (userSessionTokenObject) {
                return this.resetTTLForSessionToken(sessionToken, userSessionTokenObject.user).then(() => userSessionTokenObject);
            } else {
                throw new Error("Not authorized to enter");
            }
        });
    }

    findSessionTokenById(userSessionToken) {
        return Promise.try(() => {
            return this.sessionTokenMongooseCollection.findOne({_id: userSessionToken}).lean();
        });
    }

    invalidateTokenByUserId(userIdString) {
        return Promise.try(() => {
            return this.sessionTokenMongooseCollection.remove({"user._id": mongoose.Types.ObjectId(userIdString)}).lean();
        });
    }

    updateUser(userIdString, user) {
        return Promise.try(() => {
            user = Object.assign({}, user);
            return this.sessionTokenMongooseCollection.update({"user._id": mongoose.Types.ObjectId(userIdString)}, {$set: user}, {multi: true});
        });
    }

    upsertSessionToken(token, user) {
        return this.findSessionTokenById(token).then(userSessionToken => {
            const newExpirationDate = moment().add(this.DEFAULT_TTL.DURATION, this.DEFAULT_TTL.UNIT).toDate();
            if (userSessionToken) {
                return this.resetTTLForSessionToken(token, user);
            } else {
                const userSessionTokenObject = {_id: token, expireAt: newExpirationDate, user: user};
                return this.sessionTokenMongooseCollection.create(userSessionTokenObject);
            }
        });
    }

    deleteSessionToken(token) {
        return Promise.try(() => {
            return this.sessionTokenMongooseCollection.remove({_id: token});
        });
    }
}

module.exports = SessionTokenService;