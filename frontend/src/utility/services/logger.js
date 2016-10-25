import config from "../../config";
class Logger {
    constructor() {
        this.loggingEnabled = config.loggingEnabled
    };

    log(...args) {
        if (this.loggingEnabled) {
            console.log(...args);
        }
    }

    logError(error) {
        if (this.loggingEnabled) {
            if (error.stack) {
                console.error(error.stack);
            } else {
                console.error(error);
            }
        }
    }
}

export default new Logger();