import React from "react";
import {Route} from "react-router";
import SearchUsers from "../../components/users/search/search_users";

import routesService from "../_services/routes_service";

const routes = (
    <Route path="users" component={SearchUsers} onEnter={routesService.requireAuth}>
        <Route path="search" component={SearchUsers}/>
    </Route>
);

export default routes;