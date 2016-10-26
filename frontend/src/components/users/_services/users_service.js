import validate from "validate.js";
import userConstraints from "../_constraints/user_constraint";
import baseAPI from "../../../utility/services/base_api";

const baseURL = "users";
class UsersService {

    isValidUser(user) {
        return !validate(user, userConstraints.userConstraints());
    }

    retrieveUsers() {
        return baseAPI.get(baseURL);
    }

    addNewUser(user) {
        return baseAPI.post(baseURL, user);
    }

    updateUser(user = {}) {
        return baseAPI.put(baseURL + "/" + user._id, user);
    }

    deleteUser(userId) {
        return baseAPI.delete(baseURL + "/" + userId);
    }
}

export default new UsersService();
