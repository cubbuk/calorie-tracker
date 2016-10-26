import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button} from "react-bootstrap";
import {CTFormInput} from "../../../../utility/components/_ct_components";
import usersService from "../../_services/users_service";
import userConstraints from "../../_constraints/user_constraint";

class userForm extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {user: this.props.user};
    }

    componentWillReceiveProps(nextProps) {
        let {user = {}} = this.props;
        let {user : nextuser = {}} = nextProps
        if (user._id !== nextuser._id) {
            this.setState({user: nextProps.user, formSubmitted: false});
        }
    }

    onSaveClicked(user, e) {
        e.preventDefault();
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

    render() {
        let {disabled, isUpdate} = this.props;
        let {user = {}, formSubmitted} = this.state;
        let {username, fullName, password, caloriesPerDay} = user;
        let onSaveClicked = this.onSaveClicked.bind(this, user);
        return <form onSubmit={onSaveClicked} disabled={disabled}>
            <CTFormInput name="username"
                         autoFocus
                         label="Username"
                         disabled={isUpdate}
                         formSubmitted={formSubmitted}
                         value={username}
                         validationFunction={(username) => validate({username}, userConstraints.username(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "username")}/>
            <CTFormInput name="fullName"
                         label="fullName"
                         formSubmitted={formSubmitted}
                         value={fullName}
                         validationFunction={(fullName) => validate({fullName}, userConstraints.fullName(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "fullName")}/>
            <CTFormInput name="password"
                         label="password"
                         type="password"
                         formSubmitted={formSubmitted}
                         value={password}
                         validationFunction={(password) => validate({password}, userConstraints.password(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "password")}/>
            <CTFormInput name="calorieAmount"
                         label="calorie Amount"
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

userForm.propTypes = {
    user: PropTypes.object,
    disabled: PropTypes.bool,
    isUpdate: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default userForm;