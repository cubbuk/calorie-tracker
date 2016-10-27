const expect = require("chai").expect;
const usersService = require("../../components/users/_services/users_service");
const mongoose = require("mongoose");

describe("Password validation test", function () {

    it("password needs to be at between 6 and 20 characters ", function (done) {
        let password = "weak";
        let validationResults = usersService.validatePassword(password);
        expect(validationResults).to.have.property("password");

        password = "weawkfdfdsafdsafsdfsdfdsfs";
        validationResults = usersService.validatePassword(password);
        expect(validationResults).to.have.property("password");

        done();
    });

    it("valid password", function (done) {
        let password = "strong";
        let validationResults = usersService.validatePassword(password);
        expect(validationResults).to.not.exist;
        done();
    });

});


describe("Password tests", function () {


    it("password will be hashed and will be validated with open version", function () {
        let user = {username: "test", fullName: "test user", password: "strong", caloriesPerDay: 1000};
        return usersService.addNewUser(user).then(createdUser => {
            expect(createdUser.password).to.not.equal(user.password);
            return usersService.checkPassword(createdUser._id, user.password).then(foundUser => {
                expect(foundUser._id.toString()).to.equal(createdUser._id.toString())
            }).then(() => {
                return usersService.deleteUser(createdUser._id);
            })
        });
    });

    it("changing password works", function () {
        const newPassword = "newpassword";
        const currentPassword = "oldpassword";
        let user = {username: "test", fullName: "test user", password: currentPassword, caloriesPerDay: 1000};
        return usersService.addNewUser(user).then(createdUser => {
            return usersService.checkPassword(createdUser._id, newPassword)
                .catch(errorObject => {
                    expect(errorObject).to.have.property("error");
                    //correct password is needed to change password
                    return usersService.changePassword(createdUser._id, "wrong password", newPassword);
                }).catch(errorObject => {
                    expect(errorObject).to.have.property("error");
                    return usersService.changePassword(createdUser._id, currentPassword, newPassword);
                }).then(result => {
                    //password changed
                    expect(result).to.exist;
                    return usersService.checkPassword(createdUser._id, newPassword);
                }).then(foundUser => {
                    //password verified
                    expect(foundUser._id.toString()).to.equal(createdUser._id.toString())
                    return usersService.deleteUser(createdUser._id);
                });
        });
    });


});