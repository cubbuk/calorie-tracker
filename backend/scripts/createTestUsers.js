const Promise = require("bluebird");
const userRoleService = require("../components/users/_services/user_role_service");
const usersService = require("../components/users/_services/users_service");

function createTestUsers() {
    const users = [
        {
            username: "user",
            fullName: "User Doe",
            caloriesPerDay: 1000,
            password: "123456",
            roles: [userRoleService.getUserRoleMap().USER]
        },
        {
            username: "manager",
            fullName: "Manager Doe",
            caloriesPerDay: 1250,
            password: "123456",
            roles: [userRoleService.getUserRoleMap().USER, userRoleService.getUserRoleMap().MANAGER]
        },
        {
            username: "admin",
            fullName: "Admin Doe",
            caloriesPerDay: 1542,
            password: "123456",
            roles: [userRoleService.getUserRoleMap().USER, userRoleService.getUserRoleMap().MANAGER, userRoleService.getUserRoleMap().ADMIN]
        }];

    let promises = users.map(user => usersService.addNewUser(user));

    return Promise.all(promises).then(() => process.exit(1)).catch(err => {
        console.error(err);
        process.exit(-1);
    });
}

createTestUsers();