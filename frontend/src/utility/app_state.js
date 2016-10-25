import Promise from "bluebird";
function AppState() {
    let appState = this;
    let tripFilters = {isReturnFlight: true};
    let passengers = [];
    var progress = 2;
    let user;
    let USER_KEY = "user";

    appState.initializeAppState = () => {
        return Promise.try(() => {
            let userString = localStorage.getItem(USER_KEY);
            if (userString) {
                user = JSON.parse(userString);
            }
        }).catch(error => {
            user = undefined;
            logger.logError(error);
        });
    };

    appState.getUser = () => user;
    appState.setUser = (theUser) => Promise.try(() => {
        user = theUser;
        return localStorage.setItem(USER_KEY, JSON.stringify(user));
    }).then(() => user);
    appState.clearUser = () => Promise.try(() => {
        user = undefined;
        return localStorage.removeItem(USER_KEY);
    });

    appState.getTripFilters = () => tripFilters || {};
    appState.getFromFlight = () => {
        let {fromFlight} = tripFilters;
        return fromFlight;
    };
    appState.getReturnFlight = () => {
        let {returnFlight} = tripFilters;
        return returnFlight;
    };
    appState.getPassengers = () => passengers || [];
    appState.getProgress = () => {
        let progress = 2;
        let tripFilters = appState.getTripFilters();
        let {fromFlight, returnFlight, isReturnFlight} = tripFilters;
        if (fromFlight) {
            if (!returnFlight && isReturnFlight) {
                progress = 3;
            }
            else {
                progress = 4
            }
        }
        return progress;
    };

    appState.initializeNewSearch = () => {
        delete tripFilters.fromFlight;
        delete tripFilters.returnFlight;
        return tripFilters;
    };

    appState.totalPrice = () => {
        let result = {currency: "", totalAmount: 0};
        let {fromFlight, returnFlight} = tripFilters;
        if (fromFlight) {
            result.currency = fromFlight.currency;
            result.totalAmount += fromFlight.price || 0;
        }
        if (returnFlight) {
            result.currency = returnFlight.currency;
            result.totalAmount += returnFlight.price || 0;
        }
        return result;
    };
}

export default new AppState();