let config = {
    local: {
        baseURL: "http://0.0.0.0:8320/",
        apiPath: "http://0.0.0.0:8320/api/",
        loggingEnabled: true
    },
    "pre-prod": {
        baseURL: "/",
        apiPath: "/api/",
        loggingEnabled: false
    }
};
export default config[RUN_ENVIRONMENT] || config.local;
