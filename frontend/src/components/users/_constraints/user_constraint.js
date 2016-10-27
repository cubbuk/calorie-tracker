import _ from "lodash";

class UserConstraints {

    roles() {
        return {roles: {presence: {message: "Please select a role"}}}
    }

    username() {
        return {
            username: {
                presence: {message: "Please enter a username"},
                length: {
                    minimum: 3,
                    tooShort: "Needs to have %{count} letters or more",
                    maximum: 20,
                    tooLong: "Needs to be less than or equal %{count} letters"
                }
            }
        }
    }

    password() {
        return {
            password: {
                presence: {message: "Please enter your password"},
                length: {
                    minimum: 6,
                    tooShort: "Needs to have %{count} letters or more",
                    maximum: 20,
                    tooLong: "Needs to be less than or equal %{count} letters"
                }
            }
        }
    }

    fullName() {
        return {
            fullName: {
                presence: {message: "Please enter your name"},
                length: {
                    minimum: 3,
                    tooShort: "Needs to have %{count} letters or more",
                    maximum: 50,
                    tooLong: "Needs to be less than or equal %{count} letters"
                }
            }
        }
    }

    caloriesPerDay() {
        return {
            caloriesPerDay: {
                presence: {message: "Please enter calorie amount"},
                numericality: {
                    notValid: "Please enter a valid calorie amount",
                    greaterThanOrEqualTo: 0,
                    notGreaterThanOrEqualTo: "Needs to be more than or equal to %{count}",
                    lessThanOrEqualTo: 10000,
                    notLessThanOrEqualTo: "Needs to be less than or equal to %{count}"
                }
            }
        };
    }

    userConstraints() {
        return _.extend({}, this.roles(), this.username(), this.fullName(), this.caloriesPerDay());
    }

}

export default new UserConstraints();