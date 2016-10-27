const USER_ROLE_MAP = {
    USER: {value: 1, label: "User"},
    MANAGER: {value: 2, label: "Manager"},
    ADMIN: {value: 3, label: "Admin"}
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

    userRoleToLabel(roleValue) {
        let roleOption = userRoles.filter(role => role.value === roleValue)[0];
        if (roleOption) {
            return roleOption.label;
        }
    }

    hasUserRole(user = {}) {
        return this.hasRole(user, USER_ROLE_MAP.USER.value);
    }

    hasManagerRole(user = {}) {
        return this.hasRole(user, USER_ROLE_MAP.MANAGER.value);
    }

    hasAdminRole(user = {}) {
        return this.hasRole(user, USER_ROLE_MAP.ADMIN.value);
    }
}

export default new UserRoleService();