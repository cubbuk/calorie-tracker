import React, {PropTypes} from "react";
import Select from "react-select";
import userRoleService from "../../_services/user_role_service";

class SelectRoles extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.options = userRoleService.getUserRoles();
    }

    onChange(selectedOptions = []) {
        console.log(selectedOptions);
        if (this.props.onChange instanceof Function) {
            this.props.onSelect(selectedOptions);
        }
        if (this.props.onSelect instanceof Function) {
            this.props.onSelect(selectedOptions.map(selectedOption => selectedOption.value));
        }
    }

    render() {
        let {onChange, multi, ...otherProps} = this.props;
        return <Select onChange={this.onChange.bind(this)}
                       options={this.options}
                       multi={true}
                       {...otherProps}
        />
    }
}

SelectRoles.propTypes = {
    onSelect: PropTypes.func.isRequired
};

export default SelectRoles;

