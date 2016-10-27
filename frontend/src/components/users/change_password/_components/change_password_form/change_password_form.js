import validate from "validate.js";
import React, {PropTypes} from "react";
import {Button} from "react-bootstrap";
import {CTFormInput} from "../../../../../utility/components/_ct_components";
import userConstraints from "../../../_constraints/user_constraint";
import utilityService from "../../../../../utility/services/utility_service";

class ChangePasswordForm extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        this.state = {passwordInfo: this.props.passwordInfo};
    }

    onSubmit(passwordInfo = {}, e) {
        e.preventDefault();
        this.changePassword(passwordInfo);
    }

    isValidPasswordInfo(passwordInfo = {}) {
        return !validate(passwordInfo, userConstraints.passwordInfoConstraint());
    }

    changePassword(passwordInfo = {}) {
        if (this.isValidPasswordInfo(passwordInfo)) {
            let {onSubmit} = this.props;
            if (onSubmit instanceof Function) {
                onSubmit(passwordInfo);
            }
        }
        this.setState({formSubmitted: true});
    }

    onValueChange(fieldName, value) {
        let {passwordInfo = {}} = this.state;
        passwordInfo[fieldName] = value;
        this.setState({passwordInfo});
    }

    onKeyPress(passwordInfo, e) {
        if (utilityService.isEnterKeyEvent(e)) {
            this.changePassword(passwordInfo);
        }
    }

    render() {
        let {disabled, hideCancelButton} = this.props;
        let {passwordInfo = {}, formSubmitted} = this.state;
        let {currentPassword, newPassword, newPasswordAgain} = passwordInfo;
        let onSubmit = this.onSubmit.bind(this, passwordInfo);
        return <form onSubmit={onSubmit} disabled={disabled}
                     onKeyPress={this.onKeyPress.bind(this, passwordInfo)}>
            <CTFormInput name="currentPassword"
                         label="Current Password"
                         type="password"
                         formSubmitted={formSubmitted}
                         value={currentPassword}
                         validationFunction={(currentPassword) => validate({password: currentPassword}, userConstraints.password(true), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "currentPassword")}/>
            <CTFormInput name="newPassword"
                         label="New Password"
                         type="password"
                         formSubmitted={formSubmitted}
                         value={newPassword}
                         validationFunction={(newPassword) => validate({password: newPassword}, userConstraints.password(true), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "newPassword")}/>
            <CTFormInput name="newPasswordAgain"
                         label="New Password Again"
                         type="password"
                         formSubmitted={formSubmitted}
                         value={newPasswordAgain}
                         validationFunction={(newPasswordAgain) => validate({
                             newPassword,
                             newPasswordAgain
                         }, userConstraints.passwordAgainConstraint(), {fullMessages: false})}
                         onValueChange={this.onValueChange.bind(this, "newPasswordAgain")}/>
            <Button bsStyle="primary" className="pull-right" onClick={onSubmit}>Change Password</Button>
            {!hideCancelButton &&
            <Button bsStyle="default" className="pull-left" onClick={this.props.onCancel}>Cancel</Button>}
        </form>
    }
}

ChangePasswordForm.propTypes = {
    passwordInfo: PropTypes.object,
    disabled: PropTypes.bool,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    hideCancelButton: PropTypes.bool
};

export default ChangePasswordForm;