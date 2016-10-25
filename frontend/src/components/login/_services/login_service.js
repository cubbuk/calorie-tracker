import Promise from "bluebird";
import validate from "validate.js";
import loginConstraints from "../_constraints/login_constraints";
import appState from "../../../utility/app_state";
import userService from "../../user/services/user_service";

const EXISTING_USERS = [{
    username: "user", name: "John",
    surname: "Doe", password: "123456",
    roles: [userService.getUserRoleMap().USER]
},
    {
        username: "manager", name: "Manager",
        surname: "Doe", password: "123456",
        roles: [userService.getUserRoleMap().USER, userService.getUserRoleMap().MANAGER]
    },
    {
        username: "admin", name: "Admin",
        surname: "Doe", password: "123456",
        roles: [userService.getUserRoleMap().USER, userService.getUserRoleMap().MANAGER, userService.getUserRoleMap().ADMIN]
    }];

class LoginService {

    loginUser(user = {}) {
        return Promise.try(() => {
            let validationResult = validate(user, loginConstraints.loginConstraints(), {fullMessages: false});
            if (!validationResult) {
                let {password, username} = user;
                let matchedUser = EXISTING_USERS.filter(existingUser => existingUser.password === password && existingUser.username === username)[0];

                if (matchedUser) {
                    return appState.setUser(matchedUser);
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
