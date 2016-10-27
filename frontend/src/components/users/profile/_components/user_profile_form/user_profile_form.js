import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button} from "react-bootstrap";
import {CTFormInput} from "../../../../../utility/components/_ct_components";
import usersService from "../../../_services/users_service";
import userConstraints from "../../../_constraints/user_constraint";
import utilityService from "../../../../../utility/services/utility_service";

class UserProfileForm extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {profileInfo: this.props.profileInfo};
    }

    componentWillReceiveProps(nextProps) {
        let {profileInfo = {}} = this.props;
        let {profileInfo : nextProfileInfo = {}} = nextProps;
        if (profileInfo._id !== nextProfileInfo._id) {
            this.setState({profileInfo: nextProfileInfo, formSubmitted: false});
        }
    }

    onSaveClicked(user, e) {
        e.preventDefault();
        this.saveProfile(user);
    }

    saveProfile(profileInfo) {
        if (usersService.isValidProfileInfo(profileInfo)) {
            let {onSave} = this.props;
            if (onSave instanceof Function) {
                onSave(profileInfo);
            }
        }
        this.setState({formSubmitted: true});
    }

    onValueChange(fieldName, value) {
        let {profileInfo = {}} = this.state;
        profileInfo[fieldName] = value;
        this.setState({profileInfo});
    }

    onKeyPress(profileInfo, e) {
        if (utilityService.isEnterKeyEvent(e)) {
            this.saveProfile(profileInfo);
        }
    }

    render() {
        let {disabled} = this.props;
        let {profileInfo = {}, formSubmitted} = this.state;
        let {username, fullName, password, caloriesPerDay} = profileInfo;
        let onSaveClicked = this.onSaveClicked.bind(this, profileInfo);
        return <form onSubmit={onSaveClicked} disabled={disabled}
                     onKeyPress={this.onKeyPress.bind(this, profileInfo)}>
            <CTFormInput name="username"
                         autoFocus
                         label="Username"
                         disabled
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

UserProfileForm.propTypes = {
    profileInfo: PropTypes.object,
    disabled: PropTypes.bool,
    isUpdate: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default UserProfileForm;