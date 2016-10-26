const validate = require("validate.js");
const Promise = require("bluebird");
const mongoose = require("mongoose");
const userConstraint = require("../_constraints/user_constraint");
const userMongooseCollection = require("../_mongoose/user_mongoose_collection");
const errorService = require("../../../utility/_services/error_service");
const securityService = require("../../../utility/_services/security_service");

class UsersService {

    retrieveUser(recordId) {
        return userMongooseCollection.findOne({_id: recordId}).lean();
    }

    retrieveUsers() {
        return userMongooseCollection.find();
    }

    addNewUser(user = {}, savedBy) {
        return Promise.try(() => {
            const validationResult = this.validateUser(user);
            user = Object.assign({}, user);
            if (!validationResult) {
                const passwordValidation = this.validatePassword(user.password);
                if (!passwordValidation) {
                    return this.hashPasswordOfUser(user).then(user => {
                        user._id = mongoose.Types.ObjectId();
                        user.createdAt = new Date();
                        user.createdBy = savedBy;
                        return userMongooseCollection.create(user).then(result => result.toObject());
                    }).catch(error => {
                        if (errorService.isValidationError(error) || errorService.isUniqueKeyConstraintError(error)) {
                            return error;
                        } else {
                            throw error;
                        }
                    });
                } else {
                    return errorService.createValidationError(passwordValidation);
                }
            } else {
                return errorService.createValidationError(validationResult);
            }
        });
    }

    updateUser(userId, user = {}, savedBy) {
        return Promise.try(() => {
            user = Object.assign({}, user);
            const validationResult = this.validateUser(user);
            if (!validationResult) {
                delete user._id;
                return this.hashPasswordOfUser(user)
                    .then((user) => {
                        user.updatedAt = new Date();
                        user.updatedBy = savedBy;
                        return userMongooseCollection.update({_id: userId}, user).then(() => this.retrieveUser(userId));
                    }).catch(error => {
                        if (errorService.isValidationError(error) || errorService.isUniqueKeyConstraintError(error)) {
                            return error;
                        } else {
                            throw error;
                        }
                    });
            } else {
                return errorService.createValidationError(validationResult);
            }
        });
    }

    deleteUser(userId) {
        return userMongooseCollection.remove({_id: userId});
    }

    validateUser(record) {
        return validate(record, userConstraint.userConstraints(), {fullMessages: false});
    }

    validatePassword(password) {
        return validate({password}, userConstraint.password(), {fullMessages: false});
    }

    hashPasswordOfUser(user) {
        return Promise.try(() => {
            if (user && user.password) {
                let validationResult = this.validatePassword(user.password);
                if (validationResult) {
                    throw errorService.createValidationError(validationResult);
                } else {
                    return securityService.hashPassword(user.password).then((hashedPassword) => {
                        user.password = hashedPassword;
                        return user;
                    });
                }
            } else {
                return user;
            }
        });
    }
}

module.exports = new UsersService();