import validate from "validate.js";
import userConstraints from "../_constraints/user_constraint";
import baseAPI from "../../../utility/services/base_api";

const baseURL = "users";
class UsersService {

    isValidUser(user) {
        return !validate(user, userConstraints.userConstraints());
    }

    retrieveUsers() {
        return baseAPI.get(baseURL + "/list");
    }

    addNewUser(user) {
        return baseAPI.post(baseURL + "/create", user);
    }

    updateUser(user = {}) {
        return baseAPI.put(baseURL + "/update/" + user._id, user);
    }

    deleteUser(userId) {
        return baseAPI.delete(baseURL + "/delete/" + userId);
    }
}

export default new UsersService();
