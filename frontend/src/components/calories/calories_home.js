import React, {PropTypes} from "react";
import {PageHeader} from "react-bootstrap";
import SearchCalories from "./search/search_calories";

class CaloriesHome extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    render() {
        let {children} = this.props;
        return <div>
            <PageHeader>Calorie Records</PageHeader>
            {children || <SearchCalories/>}
        </div>;
    }
}

CaloriesHome.contextTypes = {
    router: PropTypes.object
};

export default CaloriesHome;