import btoa from "btoa";
import Promise from "bluebird";
import config from "../../config.js";
import publisher from "./publisher";
import events from "../constants/events";

let TOKEN_KEY = "token";
class BaseAPI {
    constructor() {
        this.token = localStorage.getItem(TOKEN_KEY);
    }

    getToken() {
        return this.token;
    }

    setToken(token, omitLocalStorage) {
        this.token = token;
        if (!omitLocalStorage) {
            localStorage.setItem(TOKEN_KEY, token);
        }
    }

    clearToken() {
        delete this.token;
        localStorage.removeItem(TOKEN_KEY);
    }

    send(method, options) {
        let token = this.getToken();
        if (token) {
            options = options || {};
            options.headers = options.headers || {};
            options.headers.authorization = options.headers.authorization || token;
        }
        return fetch(config.apiPath + method, options).then(this.handleResponse.bind(this))
    }

    get(method, options = {}) {
        options.method = "GET";
        return this.send(method, options);
    }

    delete(method) {
        return this.send(method, {method: "DELETE"});
    }

    post(method, body) {
        body = body || {};
        return this.send(method, {
            method: "POST", headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    put(method, body) {
        body = body || {};
        return this.send(method, {
            method: "PUT", headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
    }

    uploadImage(method, imageFile) {
        let formData = new FormData();
        formData.append("type", "file");
        formData.append("file", imageFile);
        return this.send(method, {
            method: "POST",
            body: formData
        })
    }

    createGetUrl(url, paramsObject) {
        let paramQuery = this.createUrlParamsQuery(paramsObject);
        if (paramQuery) {
            url += "?" + paramQuery;
        }
        return url;
    }

    createUrlParamsQuery(paramsObject = {}) {
        let query = "";
        Object.keys(paramsObject).forEach(paramKey => {
            let paramValue = paramsObject[paramKey];
            query += paramKey + "=" + paramValue + "&";
        });
        if (query) {
            query = query.substring(0, query.length - 1);
        }
        return query;
    }

    handleResponse(response) {
        return Promise.try(() => {
            if (response.status === 401) {
                this.clearToken();
                publisher.emitEvent(events.AUTHENTICATION_ERROR);
                return response.json();
            } else if (response.status === 403) {
                publisher.emitEvent(events.AUTHORIZATION_ERROR);
            } else {
                return response.json().then(result => {
                    if (response.status === 500) {
                        throw result;
                    } else if (response.status === 400) {
                        throw result;
                    } else {
                        if (result.error) {
                            throw result;
                        } else {
                            return result;
                        }
                    }
                });
            }
        });
    }
}

export default new BaseAPI();
