import React, {PropTypes} from "react";
import {Label} from "react-bootstrap";
import userRoleService from "../../_services/user_role_service";

class UserRoleLabels extends React.Component {
    constructor(props, context, ...args) {
        super(props, context, ...args);
    }

    render() {
        let {roles = [], ...otherProps} = this.props;
        return <span>{roles.map(role => <Label {...otherProps}>{userRoleService.userRoleToLabel(role)}</Label>)}</span>;
    }
}

UserRoleLabels.propTypes = {
    roles: PropTypes.array.isRequired,
    bsStyle: PropTypes.string
};

UserRoleLabels.defaultProps = {
    bsStyle: "primary",
    className: "margin-right-5"
};

export default UserRoleLabels;