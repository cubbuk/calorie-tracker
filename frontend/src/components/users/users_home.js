import React, {PropTypes} from "react";
import SearchUsers from "./search/search_users";

class UsersHome extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    render() {
        let {children} = this.props;
        return <div>
            {children || SearchUsers}
        </div>;
    }
}

UsersHome.contextTypes = {
    router: PropTypes.object
};

export default UsersHome;