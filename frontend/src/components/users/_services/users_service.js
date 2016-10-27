import validate from "validate.js";
import userConstraints from "../_constraints/user_constraint";
import baseAPI from "../../../utility/services/base_api";

const baseURL = "users";
class UsersService {

    isValidUser(user) {
        return !validate(user, userConstraints.userConstraints());
    }

    isValidProfileInfo(profileInfo) {
        return !validate(profileInfo, userConstraints.profileInfoConstraints());
    }

    findUserById(userId) {
        return baseAPI.get(baseURL + "/by-id/" + userId);
    }

    profileInfo() {
        return baseAPI.get(baseURL + "/profile-info");
    }

    updateProfileInfo(profileInfo) {
        return baseAPI.post(baseURL + "/profile-info", profileInfo);
    }

    changePassword(password, newPassword){
        return baseAPI.post(baseURL + "/change-password", {password, newPassword});
    }

    searchUsers(params = {}) {
        return baseAPI.post(baseURL + "/search", params);
    }

    retrieveUserList(params = {}) {
        return baseAPI.post(baseURL + "/list", params);
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
            result += fullName + " ";
        }
        if (username) {
            result += "(" + username + ")";
        }
        return result.trim();
    }
}

export default new UsersService();
