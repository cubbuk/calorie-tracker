const expect = require("chai").expect;
const usersService = require("../../components/users/_services/users_service");
const error_service = require("../../utility/_services/error_service");
const mongoose = require("mongoose");

const savedBy = mongoose.Types.ObjectId();
describe("User crud test", function () {

    it("not valid user will not be added", function () {
        let user = {username: "na"};
        return usersService.addNewUser(user, savedBy).then(result => {
            expect(error_service.isValidationError(result)).to.be.true;
        });
    });

    it("valid user will be saved, deleted and retrieved", function () {
        let user = {username: "demouser", fullName: "full user", password: "strong", caloriesPerDay: 1800};
        return usersService.addNewUser(user, savedBy).then(newCreatedUser => {
            expect(newCreatedUser).to.have.property("_id");
            return newCreatedUser._id;
        }).then((newCreatedUserId) => {
            return usersService.retrieveUser(newCreatedUserId).then(foundUser => {
                expect(foundUser).to.have.property("_id");
                expect(foundUser._id.toString()).to.equal(newCreatedUserId.toString());
                return usersService.retrieveUsers().then(results => {
                    expect(results.length === 1).to.be.true;
                    expect(foundUser._id.toString()).to.equal(results[0]._id.toString());
                    return newCreatedUserId;
                });
            });
        }).then(userId => {
            return usersService.deleteUser(userId).then(deletionResult => {
                return userId;
            });
        }).then((userIdAfterDeletion) => {
            return usersService.retrieveUser(userIdAfterDeletion).then(notFoundUser => {
                expect(notFoundUser).to.not.exist;
            });
        })
    });

    it("unique key constraints on user", function () {
        let user = {username: "demouser", fullName: "full user", password: "strong", caloriesPerDay: 1800};
        return usersService.addNewUser(user, savedBy).then(newCreatedUser => {
            expect(newCreatedUser).to.have.property("_id");
            return usersService.addNewUser(user).then((result) => {
                expect(error_service.isUniqueKeyConstraintError(result)).to.be.true;
                return usersService.deleteUser(newCreatedUser._id);
            });
        });
    });

    it("update of an user", function () {
        let user = {username: "demouser", fullName: "full user", password: "strong", caloriesPerDay: 1800};
        const updatedName = "new name";
        return usersService.addNewUser(user, savedBy).then(newCreatedUser => {
            expect(newCreatedUser).to.have.property("_id");
            let {password : hashedPassword} = newCreatedUser;
            delete newCreatedUser.password; //for not changing password during update, object should not contain password field
            newCreatedUser.fullName = updatedName;
            return usersService.updateUser(newCreatedUser._id, newCreatedUser, savedBy).then((updatedUser) => {
                expect(updatedUser._id.toString()).to.equal(newCreatedUser._id.toString());
                expect(updatedUser.fullName).to.equal(updatedName);
                expect(updatedUser.password).to.equal(hashedPassword); //password should not change during update
            }).then(() => {
                return usersService.deleteUser(newCreatedUser._id);
            });
        });
    });

    it("update password of an user", function () {
        let user = {username: "demouser", fullName: "full user", password: "strong", caloriesPerDay: 1800};
        const updatedPassword = "new password";
        return usersService.addNewUser(user, savedBy).then(newCreatedUser => {
            expect(newCreatedUser).to.have.property("_id");
            let {password : hashedPassword} = newCreatedUser;
            newCreatedUser.password = updatedPassword;
            return usersService.updateUser(newCreatedUser._id, newCreatedUser, savedBy).then((updatedUser) => {
                expect(updatedUser._id.toString()).to.equal(newCreatedUser._id.toString());
                expect(updatedUser.password).to.not.equal(hashedPassword); //password should not change during update
            }).then(() => {
                return usersService.deleteUser(newCreatedUser._id);
            });
        });
    });

    it("connot update password of an user with invalid password", function () {
        let user = {username: "demouser", fullName: "full user", password: "strong", caloriesPerDay: 1800};
        const updatedPassword = "nan";
        return usersService.addNewUser(user, savedBy).then(newCreatedUser => {
            expect(newCreatedUser).to.have.property("_id");
            let {password : hashedPassword} = newCreatedUser;
            newCreatedUser.password = updatedPassword;
            return usersService.updateUser(newCreatedUser._id, newCreatedUser, savedBy).then((result) => {
                expect(error_service.isValidationError(result)).to.be.true;
                expect(result.error).to.have.property("password");
            }).then(() => {
                return usersService.deleteUser(newCreatedUser._id);
            });
        });
    });

});