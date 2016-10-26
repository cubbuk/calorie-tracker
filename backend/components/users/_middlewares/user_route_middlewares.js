const userRoleService = require("../_services/user_role_service");
const userRoleMap = userRoleService.getUserRoleMap();

class UserRouteMiddleware {
    hasRole(requiredRoles = [], req, res, next) {
        let {user = {}} = req;
        let {roles = []} = user;
        let missingRole = false;
        requiredRoles.forEach(requiredRole => {
            if (!roles.includes(requiredRole)) {
                missingRole = true;
            }
        });
        if (missingRole) {
            res.send(403);
        } else {
            next();
        }
    }

    managerRoute(req, res, next) {
        this.hasRole([userRoleMap.MANAGER], req, res, next)
    }

    adminRoute(req, res, next) {
        this.hasRole([userRoleMap.ADMIN], req, res, next)
    }
}

module.exports = new UserRouteMiddleware();