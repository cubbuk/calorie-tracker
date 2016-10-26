import Promise from "bluebird";
import publisher from "./services/publisher";
import events from "./constants/events";

const USER_KEY = "user";
class AppState {

    constructor() {
        publisher.subscribeToEvent(events.AUTHENTICATION_ERROR, () => this.clearUser());
        this.initializeAppState();
    }

    initializeAppState() {
        return Promise.try(() => {
            let userString = localStorage.getItem(USER_KEY);
            if (userString) {
                this.user = JSON.parse(userString);
            }
        }).catch(error => {
            this.user = undefined;
            logger.logError(error);
        });
    }

    getUser() {
        return this.user;
    }

    setUser(user) {
        return Promise.try(() => {
            this.user = user;
            return localStorage.setItem(USER_KEY, JSON.stringify(user));
        }).then(() => this.user);
    }

    clearUser() {
        return Promise.try(() => {
            this.user = undefined;
            return localStorage.removeItem(USER_KEY);
        });
    }
}

export default new AppState();