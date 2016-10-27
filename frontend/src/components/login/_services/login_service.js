import btoa from "btoa";
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
                let {username, password} = user;
                const auth = btoa(username + ":" + password); //BinaryToAsciiEncoding
                return baseApi.send("login", {
                    method: "POST", headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "authorization": auth
                    }
                }).then(result => {
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
        return baseApi.post("logout").then(() => {
            appState.clearUser();
            baseApi.clearToken();
        });
    }

}

export default new LoginService();
