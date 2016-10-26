const userRoleService = require("../../components/users/_services/user_role_service");
const userRoleMap = userRoleService.getUserRoleMap();

class UserRouteMiddleware {
    hasRole(requiredRoles = [], req, res, next) {
        let {user = {}} = req;
        let {roles = []} = user;
        if (requiredRoles.filter(requiredRole => roles.includes(requiredRole)).length > 0) {
            next();
        } else {
            res.send(403);
        }
    }

    managerRoute(req, res, next) {
        this.hasRole([userRoleMap.MANAGER, userRoleMap.ADMIN], req, res, next)
    }

    adminRoute(req, res, next) {
        this.hasRole([userRoleMap.ADMIN], req, res, next)
    }
}

module.exports = new UserRouteMiddleware();