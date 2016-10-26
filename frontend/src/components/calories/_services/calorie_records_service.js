import validate from "validate.js";
import calorieRecordConstraint from "../_constraints/calorie_record_constraint";
import baseAPI from "../../../utility/services/base_api";

const baseURL = "calorie-records";
class CaloriesService {

    isValidCalorieRecord(calorieRecord) {
        return !validate(calorieRecord, calorieRecordConstraint.calorieRecordConstraints());
    }

    retrieveCalorieRecords() {
        return baseAPI.get(baseURL);
    }

    addNewCalorieRecord(calorieRecord) {
        return baseAPI.post(baseURL, calorieRecord);
    }

    updateCalorieRecord(calorieRecord = {}) {
        return baseAPI.put(baseURL + "/" + calorieRecord._id, calorieRecord);
    }

    deleteCaloryRecord(calorieRecordId) {
        return baseAPI.delete(baseURL + "/" + calorieRecordId);
    }
}

export default new CaloriesService();
