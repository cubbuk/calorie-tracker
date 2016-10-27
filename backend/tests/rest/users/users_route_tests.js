const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require("../../../server");
let should = chai.should();
chai.use(chaiHttp);

const expect = chai.expect;
const usersService = require("../../../components/users/_services/users_service");
const mongoose = require("mongoose");



describe("Users Route tests", function () {

    it("return 401 without authorization", function (done) {
        chai.request(server)
            .post("/api/users/search", {})
            .end(function(err, res){
                res.should.have.status(401);
                done();
            });
    });

});