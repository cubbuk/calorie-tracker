import moment from "moment";
import _ from "lodash";

class StringUtility {
    constructor() {
    };

    formatMinutes(numberOfMinutes) {
        let hour = _.padStart(Math.floor(numberOfMinutes / 60), 2, "0");
        let minutes = _.padStart(Math.floor(numberOfMinutes % 60), 2, "0");
        return hour + ":" + minutes;
    }

    formatMilliseconds(numberOfMilliseconds) {
        let formattedResult = "";
        let days = moment.duration(numberOfMilliseconds).days();
        let hours = moment.duration(numberOfMilliseconds).hours();
        let minutes = moment.duration(numberOfMilliseconds).minutes();

        if (days > 0) {
            formattedResult += days + "g ";
        }
        if (hours > 0) {
            formattedResult += hours + "s ";
        }
        if (minutes > 0) {
            formattedResult += minutes + "d ";
        }

        return formattedResult.trim();
    }
}

export default new StringUtility();