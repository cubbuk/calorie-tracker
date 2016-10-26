import validate from "validate.js";
import userConstraints from "../_constraints/user_constraint";
import baseAPI from "../../../utility/services/base_api";

const baseURL = "users";
class UsersService {

    isValidUser(user) {
        return !validate(user, userConstraints.userConstraints());
    }

    findUserById(userId){
        return baseAPI.get(baseURL + "/byId/" + userId);
    }

    searchUsers(searchParams = {}) {
        return baseAPI.post(baseURL + "/search", {searchParams});
    }

    retrieveUserList(searchParams = {}){
        return baseAPI.post(baseURL + "/list", {searchParams});
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

    toFullNameWithUsername(user = {}) {
        let {fullName = "", username = ""} = user;
        let result = "";
        if (fullName) {
            result +=  fullName + " ";
        }
        if (username) {
            result += "(" + username + ")";
        }
        return result.trim();
    }
}

export default new UsersService();
