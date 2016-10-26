const _ = require("lodash");
class CalorieRecordConstraints {

    recordDate() {
        return {
            recordDate: {
                presence: {message: "Please enter a record date"}
            }
        }
    }

    description() {
        return {
            description: {
                presence: {message: "Please enter a description"},
                length: {
                    minimum: 2,
                    tooShort: "Needs to have %{count} letters or more",
                    maximum: 100,
                    tooLong: "Needs to be less than or equal to %{count} letters"
                }
            }
        };
    }

    calorieAmount() {
        return {
            calorieAmount: {
                presence: {message: "Please enter calorie amount"},
                numericality: {
                    notValid: "Please enter a valid calorie amount",
                    greaterThanOrEqualTo: 0,
                    notGreaterThanOrEqualTo: "Needs to be more than or equal to %{count}",
                    lessThanOrEqualTo: 2500,
                    notLessThanOrEqualTo: "Needs to be less than or equal to %{count}"
                }
            }
        };
    }

    calorieRecordConstraints() {
        return _.extend({}, this.recordDate(), this.description(), this.calorieAmount());
    }

}

module.exports = new CalorieRecordConstraints();