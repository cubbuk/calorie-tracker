import baseAPI from "../../../utility/services/base_api";

class SignupService {

    signupUser(signupInfo = {}) {
        return baseAPI.post("signup", signupInfo);
    }

}

export default new SignupService();
