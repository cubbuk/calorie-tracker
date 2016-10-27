import React, {PropTypes} from "react";

class UsersHome extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    render() {
        let {children} = this.props;
        return <div>{children}</div>;
    }
}

UsersHome.contextTypes = {
    router: PropTypes.object
};

export default UsersHome;