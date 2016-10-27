import React from "react";
import {Route} from "react-router";
import UsersHome from "../../components/users/users_home";
import SearchUsers from "../../components/users/search/search_users";
import UserProfile from "../../components/users/profile/user_profile";
import ChangePassword from "../../components/users/change_password/change_password";

import routesService from "../_services/routes_service";

const routes = (
    <Route path="users" component={UsersHome} onEnter={routesService.requireAuth}>
        <Route path="search" component={SearchUsers}/>
        <Route path="profile" component={UserProfile}/>
        <Route path="change-password" component={ChangePassword}/>
    </Route>
);

export default routes;