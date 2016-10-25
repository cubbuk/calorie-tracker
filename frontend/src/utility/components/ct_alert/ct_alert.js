import React, {PropTypes} from "react";
import {Alert} from "react-bootstrap";


class CTAlert extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {};
    }

    render() {
        let {children, show, ...otherProps} = this.props;
        let view = null;
        if (show) {
            view = <Alert {...otherProps}>{children}</Alert>;
        }
        return view;
    }
}

CTAlert.propTypes = {show: PropTypes.bool};

export default CTAlert;
