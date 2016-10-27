const Promise = require("bluebird");
const mongoose = require("mongoose");
class TestUtility {
    constructor(){
        this.conn = mongoose.connect("mongodb://localhost/calorie_tracker_test_db");
    }
    dropTestDatabase(message) {
        return new Promise((resolve, reject) => {
            this.conn.connection.dropDatabase((err) => {
                if (err) {
                    console.log(new Date() + " - " + err);
                    reject(err);
                } else {
                    console.log(new Date() + "  " + message + "\n");
                    resolve();
                }
            });
        });
    }
}

module.exports = new TestUtility();