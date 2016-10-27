import validate from "validate.js";
import React, {PropTypes} from "react";
import {Link} from "react-router";
import {Button, Col, Panel, Row} from "react-bootstrap";
import {CTError, CTFormInput} from "utility/components/_ct_components";
import IndexNavbar from "components/index/_components/index_navbar/index_navbar";
import loginConstraints from "./_constraints/login_constraints";
import loginService from "./_services/login_service";

class Login extends React.Component {

    constructor(props, context, ...args) {
        super(props, context, ...args);
        let {location = {}} = props;
        let {query = {}} = location;
        let {username} = query;
        this.state = {username};
    }

    onValueChange(fieldName, value) {
        this.setState({[fieldName]: value});
    }

    onLogin(username, password, e) {
        e.preventDefault();
        loginService.loginUser({username, password})
            .then(() => {
                let {location} = this.props;
                let {router} = this.context;
                if (location.state && location.state.nextPathname) {
                    router.replace({pathname: location.state.nextPathname, query: location.state.nextQuery})
                } else {
                    router.replace('/');
                }
                this.setState({error: undefined, formSubmitted: true});
            })
            .catch(error => this.setState({error, formSubmitted: true}))
    }

    renderFooter() {
        let {username} = this.state;
        return <Row>
            <Col xs={12}><Link to={{pathname: "signup", query: {username}}}>New member?</Link></Col>
        </Row>;
    }

    render() {
        let {error, formSubmitted, username, password} = this.state;
        return <div>
            <IndexNavbar/>
            <Row>
                <Col xs={12} md={6} mdOffset={3}>
                    <Panel header="Login" bsStyle="primary" footer={this.renderFooter()}>
                        <CTError error={error}/>
                        <form onSubmit={this.onLogin.bind(this, username, password)}>
                            <CTFormInput name="username"
                                         autoFocus
                                         label="Username"
                                         formControlClass={this.DEFAULT_FORM_COCTROL_CLASS}
                                         formGroupClass={this.DEFAULT_FORM_GROUP_CLASS}
                                         labelClass={this.DEFAULT_LABEL_CLASS}
                                         formSubmitted={formSubmitted}
                                         value={username}
                                         validationFunction={(username) => validate({username}, loginConstraints.username(), {fullMessages: false})}
                                         onValueChange={this.onValueChange.bind(this, "username")}/>
                            <CTFormInput name="password"
                                         label="Password"
                                         type="password"
                                         formControlClass={this.DEFAULT_FORM_COCTROL_CLASS}
                                         formGroupClass={this.DEFAULT_FORM_GROUP_CLASS}
                                         labelClass={this.DEFAULT_LABEL_CLASS}
                                         formSubmitted={formSubmitted}
                                         value={password}
                                         validationFunction={(password) => validate({password}, loginConstraints.password(), {fullMessages: false})}
                                         onValueChange={this.onValueChange.bind(this, "password")}/>
                            <Button bsStyle="primary"
                                    className="pull-right"
                                    type="submit"
                                    onClick={this.onLogin.bind(this, username, password)}>Login</Button>
                        </form>
                    </Panel>
                </Col>
            </Row>
        </div>;
    }
}

Login.prototype.DEFAULT_FORM_COCTROL_CLASS = "form-control nt-search-input";
Login.prototype.DEFAULT_LABEL_CLASS = "control-label select-label";
Login.prototype.DEFAULT_FORM_GROUP_CLASS = "form-group white-bg";

Login.contextTypes = {
    router: PropTypes.object
};


export default Login;