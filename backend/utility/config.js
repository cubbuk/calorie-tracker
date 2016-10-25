(function () {
    const config = {
        local: {
            MONGO_URL: "mongodb://localhost/calorie-tracker"
        }
    };

    process.env.NODE_ENV = process.env.NODE_ENV || "local";
    module.exports = config[process.env.NODE_ENV];
})();
