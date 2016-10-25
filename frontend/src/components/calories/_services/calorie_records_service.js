import validate from "validate.js";
import caloryRecordConstraint from "../_constraints/calory_record_constraint";
import baseAPI from "../../../utility/services/base_api";

class CaloriesService {

    isValidCaloryRecord(caloryRecord) {
        return !validate(caloryRecord, caloryRecordConstraint.caloryRecordConstraints());
    }

    retrieveCalorieRecords() {
        return baseAPI.get("calorie-records");
    }
}

export default new CaloriesService();
