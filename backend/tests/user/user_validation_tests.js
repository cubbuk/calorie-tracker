const expect = require("chai").expect;
const usersService = require("../../components/users/_services/users_service");

describe("User validation test", function () {

    it("username needs to be at least 3 characters", function (done) {
        let user = {username: "na"};
        let validationResults = usersService.validateUser(user);
        expect(validationResults).to.have.property("username");
        done();
    });

    it("fullname needs to be at least 3 characters ", function (done) {
        let user = {username: "demouser", fullName: "no"};
        let validationResults = usersService.validateUser(user);
        expect(validationResults).to.have.property("fullName");
        done();
    });

    it("calories per day needs to be set ", function (done) {
        let user = {username: "demouser", fullName: "valid name", caloriesPerDay: -1};
        let validationResults = usersService.validateUser(user);
        expect(validationResults).to.have.property("caloriesPerDay");
        done();
    });

    it("valid user", function (done) {
        let user = {username: "demouser", fullName: "valid name", caloriesPerDay: 100, password: "strong"};
        let validationResults = usersService.validateUser(user);
        expect(validationResults).to.not.exist;
        done();
    });

});

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