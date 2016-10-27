import React from "react";
import {Route, IndexRoute} from "react-router";
import Index from "components/index/index";
import CaloriesHome from "components/calories/calories_home";
import Login from "components/login/login";
import Signup from "components/signup/signup";
import NoMatch from "components/no_match";
import routesService from "routes/_services/routes_service";
import caloriesRoute from "routes/calories/calories_route";
import usersRoute from "routes/users/users_route";

const routes = (
    <Route path="/" component={Index}>
        <IndexRoute component={CaloriesHome} onEnter={routesService.requireAuth}/>
        <Route path="login" component={Login} onEnter={routesService.alreadyLoggedIn}/>
        <Route path="signup" component={Signup} onEnter={routesService.alreadyLoggedIn}/>
        {caloriesRoute}
        {usersRoute}
        <Route path="*" component={NoMatch}/>
    </Route>
);

export default routes;