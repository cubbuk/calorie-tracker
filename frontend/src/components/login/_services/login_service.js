import Promise from "bluebird";
import validate from "validate.js";
import baseApi from "../../../utility/services/base_api";
import loginConstraints from "../_constraints/login_constraints";
import appState from "../../../utility/app_state";

class LoginService {

    loginUser(user = {}) {
        return Promise.try(() => {
            let validationResult = validate(user, loginConstraints.loginConstraints(), {fullMessages: false});
            if (!validationResult) {
                return baseApi.login("login", user.username, user.password).then((result) => {
                    if (result.authenticated) {
                        baseApi.setToken(result.token);
                        return appState.setUser(result.user);
                    } else {
                        throw {errorMessage: "You entered invalid credentials, please try again"};
                    }
                });
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
