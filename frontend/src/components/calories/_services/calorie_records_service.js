import validate from "validate.js";
import caloryRecordConstraint from "../_constraints/calory_record_constraint";
import baseAPI from "../../../utility/services/base_api";

class CaloriesService {

    isValidCaloryRecord(calorieRecord) {
        return !validate(calorieRecord, caloryRecordConstraint.caloryRecordConstraints());
    }

    retrieveCalorieRecords() {
        return baseAPI.get("calorie-records");
    }

    addNewCaloryRecord(calorieRecord) {
        return baseAPI.post("calorie-records", calorieRecord);
    }
}

export default new CaloriesService();
