import moment from "moment";
import Promise from "bluebird";
import moment_locale_tr from "moment/locale/tr.js";
import React from "react";
import ReactDOM, {render} from "react-dom";
import {Router, hashHistory}from "react-router";

import "whatwg-fetch";
import "./assets/css/main.css";
import "./assets/css/bootstrap.css";
import "./assets/css/main.css";
import "react-date-picker/index.css";
import "rc-slider/assets/index.css";
import 'react-select/dist/react-select.css';

import appState from "utility/app_state";

import routes from "./routes.js";

moment.updateLocale("tr", moment_locale_tr);
Promise.config({longStackTraces: true, warnings: true});

appState.initializeAppState().then(() => {
    render(<Router routes={routes} history={hashHistory}/>, document.getElementById("content"));
});