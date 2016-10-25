const _ = require("lodash");
class CaloryRecordConstraints {

    description() {
        return {
            description: {
                presence: {message: "Please enter a description"},
                length: {
                    minimum: 2,
                    tooShort: "Needs to have %{count} letters or more",
                    maximum: 100,
                    greaterThan: "Needs to be less than %{count} letters"
                }
            }
        };
    }

    caloryAmount() {
        return {
            caloryAmount: {
                presence: {message: "Please enter calory amount"},
                numericality: {
                    notValid: "Please enter a valid calory amount",
                    greaterThanOrEqualTo: 0,
                    notGreaterThanOrEqualTo: "Needs to be more than or equal to %{count}",
                    lessThanOrEqualTo: 2500,
                    notLessThanOrEqualTo: "Needs to be less than or equal to %{count}"
                }
            }
        };
    }

    caloryRecordConstraints() {
        return _.extend({}, this.description(), this.caloryAmount());
    }

}

module.exports = new CaloryRecordConstraints();