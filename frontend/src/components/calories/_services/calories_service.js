import validate from "validate.js";
import caloryRecordConstraint from "../_constraints/calory_record_constraint";
class CaloriesService {

    isValidCaloryRecord(caloryRecord) {
        return !validate(caloryRecord, caloryRecordConstraint.caloryRecordConstraints());
    }
}

export default new CaloriesService();
