const USER_ROLE_MAP = {
    USER: 1,
    MANAGER: 2,
    ADMIN: 3
};
let userRoles = Object.keys(USER_ROLE_MAP).map(userRole => USER_ROLE_MAP[userRole]);

class UserRoleService {

    getUserRoleMap() {
        return USER_ROLE_MAP;
    }

    getUserRoles() {
        return userRoles;
    }

    hasRole(user = {}, givenRole) {
        let {roles = []} = user;
        return roles.filter(role => role === givenRole).length > 0;
    }

    hasUserRole(user = {}) {
        return this.hasRole(user, USER_ROLE_MAP.USER);
    }

    hasManagerRole(user = {}) {
        return this.hasRole(user, USER_ROLE_MAP.MANAGER);
    }

    hasAdminRole(user = {}) {
        return this.hasRole(user, USER_ROLE_MAP.ADMIN);
    }
}

export default new UserRoleService();