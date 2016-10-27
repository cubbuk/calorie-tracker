import React from "react";
import {Route} from "react-router";
import CaloriesHome from "../../components/calories/calories_home";
import SearchCalories from "components/calories/search/search_calories";

import routesService from "routes/_services/routes_service";

const routes = (
    <Route path="calories" component={CaloriesHome} onEnter={routesService.requireAuth}>
        <Route path="search" component={SearchCalories}/>
    </Route>
);

export default routes;