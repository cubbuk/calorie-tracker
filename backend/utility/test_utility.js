const Promise = require("bluebird");
const mongoose = require("mongoose");
class TestUtility {
    constructor(){
        this.conn = mongoose.connect("mongodb://localhost/calorie_tracker_test_db");
    }
    dropTestDatabase() {
        return new Promise((resolve, reject) => {
            this.conn.connection.dropDatabase((err) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = new TestUtility();