/*globals require, module*/

class PathService {
    constructor() {
        this.WHITE_LIST_URLS = {};
    }

    removeLeadingSlash(str) {
        str = str || "";
        if (str.startsWith("/")) {
            str = str.substr(1);
        }
        return str;
    }

    pathStartsWithGivenPath(path, givenPath) {
        path = this.removeLeadingSlash(path);
        givenPath = this.removeLeadingSlash(givenPath);
        return path.startsWith(givenPath);
    }

    addPathToWhiteList(path) {
        path = this.removeLeadingSlash(path);
        this.WHITE_LIST_URLS[path] = 1;
    }

    isInWhiteList(path) {
        path = this.removeLeadingSlash(path);
        return this.WHITE_LIST_URLS[path];
    }
}

module.exports = new PathService();