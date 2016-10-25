import _ from "lodash";
class LoginConstraints {

    username() {
        return {
            username: {
                presence: {message: "Please enter your username"},
            }
        };
    }

    password() {
        return {
            password: {
                presence: {message: "Please enter your password"},
            }
        };
    }

    loginConstraints() {
        return _.extend({}, this.username(), this.password());
    }

}

export default new LoginConstraints();
