(function () {
    const config = {
        local: {
            MONGO_URL: "mongodb://localhost/calorie_tracker"
        },
        test: {
            MONGO_URL: "mongodb://localhost/calorie_tracker_test_db"
        }
    };

    process.env.NODE_ENV = process.env.NODE_ENV || "local";
    module.exports = config[process.env.NODE_ENV];
})();
