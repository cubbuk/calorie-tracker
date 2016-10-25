import validate from "validate.js";
import calorieRecordConstraint from "../_constraints/calorie_record_constraint";
import baseAPI from "../../../utility/services/base_api";

class CaloriesService {

    isValidCalorieRecord(calorieRecord) {
        return !validate(calorieRecord, calorieRecordConstraint.calorieRecordConstraints());
    }

    retrieveCalorieRecords() {
        return baseAPI.get("calorie-records");
    }

    addNewCalorieRecord(calorieRecord) {
        return baseAPI.post("calorie-records", calorieRecord);
    }

    updateCalorieRecord(calorieRecord = {}) {
        return baseAPI.put("calorie-records/" + calorieRecord._id, calorieRecord);
    }

    deleteCaloryRecord(calorieRecordId) {
        return baseAPI.delete("calorie-records/" + calorieRecordId);
    }
}

export default new CaloriesService();
