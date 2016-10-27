const expect = require("chai").expect;
const usersService = require("../../components/users/_services/users_service");
const user_role_service = require("../../components/users/_services/user_role_service");
const mongoose = require("mongoose");


describe("Signup tests", function () {


    it("session token should be return beside user after signup", function () {
        let user = {username: "signupuser", fullName: "signup user", password: "strong", caloriesPerDay: 1000};
        return usersService.signupUser(user).then(result => {
            let {token, user} = result;
            expect(token).to.exist;
            expect(user).to.have.property("_id");
            expect(user.username).to.equal(user.username);
            expect(user.roles).includes(user_role_service.getUserRoleMap().USER);
            expect(user.roles.length).to.equal(1); // new signed up user can onle have USER role
            return usersService.signupUser(user).then((error) => {
                // second time to signup with same user name will create an error
                expect(error).to.have.property("error");
               return user;
            });
        }).then((signedUpUser) => {
            return usersService.deleteUser(signedUpUser._id);
        })
    });

});