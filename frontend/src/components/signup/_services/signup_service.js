import _ from "lodash";
import btoa from "btoa";
import baseAPI from "../../../utility/services/base_api";

class SignupService {

    signupUser(signupInfo = {}) {
        signupInfo = _.clone(signupInfo);
        let {password} = signupInfo;
        delete signupInfo.password;
        const auth = btoa(password); //BinaryToAsciiEncoding
        return baseAPI.send("signup", {
            method: "POST", headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "authorization": auth
            },
            body: JSON.stringify(signupInfo)
        });
    }

}

export default new SignupService();
