import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button} from "react-bootstrap";
import {CTFormInput} from "../../../../utility/components/_ct_components";
import SelectRoles from "../select_roles/select_roles";
import usersService from "../../_services/users_service";
import userConstraints from "../../_constraints/user_constraint";
import utilityService from "../../../../utility/services/utility_service";

class UserForm extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {user: this.props.user};
    }

    componentWillReceiveProps(nextProps) {
        let {user = {}} = this.props;
        let {user : nextUser = {}} = nextProps;
        if (user._id !== nextUser._id) {
            this.setState({user: nextProps.user, formSubmitted: false});
        }
    }

    onSaveClicked(user, e) {
        e.preventDefault();
        this.saveUser(user);
    }

    saveUser(user) {
        if (usersService.isValidUser(user)) {
            let {onSave} = this.props;
            if (onSave instanceof Function) {
                onSave(user);
            }
        }
        this.setState({formSubmitted: true});
    }

    onValueChange(fieldName, value) {
        let {user = {}} = this.state;
        user[fieldName] = value;
        this.setState({user});
    }

    onKeyPress(user, e) {
        if (utilityService.isEnterKeyEvent(e)) {
            this.saveUser(user);
        }
    }

    render() {
        let {disabled, isUpdate} = this.props;
        let {user = {}, formSubmitted} = this.state;
        let {username, fullName, password, caloriesPerDay, roles = []} = user;
        let onSaveClicked = this.onSaveClicked.bind(this, user);
        return <form onSubmit={onSaveClicked} disabled={disabled}
                     onKeyPress={this.onKeyPress.bind(this, user)}>
            <CTFormInput name="username"
                         autoFocus
                         label="Username"
                         disabled={isUpdate}
                         formSubmitted={formSubmitted}
                         value={username}
                         validationFunction={(username) => validate({username}, userConstraints.username(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "username")}/>
            <CTFormInput name="fullName"
                         label="Full Name"
                         formSubmitted={formSubmitted}
                         value={fullName}
                         validationFunction={(fullName) => validate({fullName}, userConstraints.fullName(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "fullName")}/>
            <CTFormInput name="password"
                         label="Password"
                         type="password"
                         formSubmitted={formSubmitted}
                         value={password}
                         validationFunction={(password) => validate({password}, userConstraints.password(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "password")}/>
            <CTFormInput label="Roles"
                         value={roles}
                         formSubmitted={formSubmitted}
                         validationFunction={(roles) => validate({roles}, userConstraints.roles(), {fullMessages: false})}>
                <SelectRoles placeholder="Select roles" value={roles}
                             onSelect={this.onValueChange.bind(this, "roles")}/>
            </CTFormInput>
            <CTFormInput name="caloriesPerDay"
                         label="Calories Per Day"
                         type="number"
                         formSubmitted={formSubmitted}
                         value={caloriesPerDay}
                         validationFunction={(caloriesPerDay) => validate({caloriesPerDay}, userConstraints.caloriesPerDay(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "caloriesPerDay")}/>
            <Button bsStyle="primary" className="pull-right" onClick={onSaveClicked}>Save User</Button>
            <Button bsStyle="default" className="pull-left" onClick={this.props.onCancel}>Cancel</Button>
        </form>
    }
}

UserForm.propTypes = {
    user: PropTypes.object,
    disabled: PropTypes.bool,
    isUpdate: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default UserForm;