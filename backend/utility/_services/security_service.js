const Promise = require("bluebird");
const bcrypt = require("bcrypt");

class SecurityService {
    hashPassword(plainPassword) {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, function (err, salt) {
                if (err) {
                    reject(err);
                } else {
                    bcrypt.hash(plainPassword, salt, function (err, hash) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(hash);
                        }
                    });
                }
            });
        });
    }

    checkPassword(plainPassword, passwordHash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(plainPassword, passwordHash, function (err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

module.exports = new SecurityService();