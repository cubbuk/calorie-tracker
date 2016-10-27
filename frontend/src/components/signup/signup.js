import Promise from "bluebird";
import validate from "validate.js";
import React, {PropTypes} from "react";
import {Link} from "react-router";
import {Button, Col, Row, Panel} from "react-bootstrap";
import {CTError, CTFormInput} from "utility/components/_ct_components";
import IndexNavbar from "components/index/_components/index_navbar/index_navbar";
import userConstraints from "../users/_constraints/user_constraint.js";
import signupService from "./_services/signup_service";
import appState from "../../utility/app_state";
import baseAPI from "../../utility/services/base_api";

class Signup extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        let {location = {}} = props;
        let {query = {}} = location;
        let {username} = query;
        this.state = {signupInfo: {username}};
    }

    onValueChange(fieldName, value) {
        let {signupInfo = {}} = this.state;
        signupInfo[fieldName] = value;
        this.setState({signupInfo});
    }

    onSignup(signupInfo, e) {
        e.preventDefault();
        return Promise.try(() => {
            let validationResult = validate(signupInfo, userConstraints.signupConstraint(), {fullMessages: false});
            if (!validationResult) {
                let {username, fullName, newPassword: password} = signupInfo;
                return signupService.signupUser({username, fullName, password}).then(result => {
                    return Promise.all([baseAPI.setToken(result.token), appState.setUser(result.user)]);
                }).then(() => {
                    let {router} = this.context;
                    router.push("/");
                }).catch(error => this.setState({error, formSubmitted: true}));
            } else {
                this.setState({formSubmitted: true});
            }
        })
    }

    renderFooter() {
        let {signupInfo = {}} = this.state;
        let {username} = signupInfo;
        return <Row>
            <Col xs={12}><Link to={{pathname: "login", query: {username}}}>Already a member?</Link></Col>
        </Row>;
    }

    render() {
        let {error, formSubmitted, signupInfo = {}} = this.state;
        let {username, fullName, newPassword, newPasswordAgain} = signupInfo;
        const onSignUp = this.onSignup.bind(this, signupInfo);
        return <div>
            <IndexNavbar/>
            <Row>
                <Col xs={12} md={6} mdOffset={3}>
                    <Panel header="Signup" bsStyle="primary" footer={this.renderFooter()}>
                        <CTError error={error}/>
                        <form onSubmit={onSignUp}>
                            <CTFormInput name="username"
                                         autoFocus
                                         label="Username"
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
                                         value={newPassword}
                                         validationFunction={(newPassword) => validate({newPassword}, {newPassword: userConstraints.createPasswordConstraint(true)}, {fullMessages: false})}
                                         onValueChange={this.onValueChange.bind(this, "newPassword")}/>
                            <CTFormInput name="passwordAgain"
                                         label="Password Again"
                                         type="password"
                                         formSubmitted={formSubmitted}
                                         value={newPasswordAgain}
                                         validationFunction={(newPasswordAgain) => validate({
                                             newPassword,
                                             newPasswordAgain
                                         }, userConstraints.passwordAgainConstraint(), {fullMessages: false})}
                                         onValueChange={this.onValueChange.bind(this, "newPasswordAgain")}/>
                            <Button bsStyle="primary"
                                    className="pull-right"
                                    type="submit"
                                    onClick={onSignUp}>Sign up</Button>
                        </form>
                    </Panel>
                </Col>
            </Row>
        </div>
    }
}

Signup.contextTypes = {
    router: PropTypes.object
};


export default Signup;