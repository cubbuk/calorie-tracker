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

    createPasswordConstraint(required) {
        const constraint = {
            length: {
                minimum: 6,
                tooShort: "Needs to have %{count} letters or more",
                maximum: 20,
                tooLong: "Needs to be less than or equal %{count} letters"
            }
        };
        if (required) {
            constraint.presence = {message: "Please enter your password"};
        }
        return constraint;
    }

    passwordAgainConstraint() {
        return {newPasswordAgain: {equality: {attribute: "newPassword", message: "Entered passwords don't match"}}};
    }

    password(required) {
        return {password: this.createPasswordConstraint(required)};
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
        return _.extend({}, this.password(), this.roles(), this.username(), this.fullName(), this.caloriesPerDay());
    }

    profileInfoConstraints() {
        return _.extend({}, this.password(), this.username(), this.fullName(), this.caloriesPerDay());
    }

    passwordInfoConstraint() {
        return _.extend({},
            {currentPassword: this.createPasswordConstraint(true)},
            {newPassword: this.createPasswordConstraint(true)},
            this.passwordAgainConstraint());
    }

}

export default new UserConstraints();