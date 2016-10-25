import Promise from "bluebird";
import validate from "validate.js";
import loginConstraints from "../_constraints/login_constraints";
import appState from "../../../utility/app_state";

class LoginService {

    loginUser(user = {}) {
        return Promise.try(() => {
            let validationResult = validate(user, loginConstraints.loginConstraints(), {fullMessages: false});
            if (!validationResult) {
                let {password, username} = user;
                if (password === "123456" && username === "deneme") {
                    let user = {username: "deneme", name: "John", surname: "Doe"};
                    return appState.setUser(user);
                } else {
                    throw {errorMessage: "You entered invalid credentials, please try again"};
                }
            } else {
                throw validationResult;
            }
        })
    }

    logoutUser() {
        return Promise.try(() => {
            return appState.clearUser();
        });
    }

}

export default new LoginService();
