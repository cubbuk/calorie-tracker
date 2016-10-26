import validate from "validate.js";
import calorieRecordConstraint from "../_constraints/calorie_record_constraint";
import baseAPI from "../../../utility/services/base_api";

const baseURL = "calorie-records";
class CaloriesService {

    isValidCalorieRecord(calorieRecord) {
        return !validate(calorieRecord, calorieRecordConstraint.calorieRecordConstraints());
    }

    retrieveCalorieRecords(searchParams = {}) {
        return baseAPI.post(baseURL + "/list", {searchParams});
    }

    retrieveCalorieRecordsOfCurrentUser(searchParams = {}) {
        return baseAPI.post(baseURL + "/list-of-user", {searchParams});
    }

    addNewCalorieRecord(calorieRecord) {
        return baseAPI.post(baseURL + "/create", calorieRecord);
    }

    updateCalorieRecord(calorieRecord = {}) {
        return baseAPI.put(baseURL + "/update/" + calorieRecord._id, calorieRecord);
    }

    deleteCaloryRecord(calorieRecordId) {
        return baseAPI.delete(baseURL + "/delete/" + calorieRecordId);
    }
}

export default new CaloriesService();
